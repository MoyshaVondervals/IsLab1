
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Layout,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    Typography,
    Segmented,
    Divider,
    Card,
    Alert,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "../../styles/dragons.css";
import { useSelector } from "react-redux";
import DragonTable from "../DragonTable";

import { GetApi, DragonApi } from "../../api";
import { apiConfig } from "../../apiConfig";

const { Header, Content } = Layout;
const { Title, Text } = Typography;


const DRAGON_TYPES = ["WATER", "UNDERGROUND", "AIR", "FIRE"];
const COLOR_ENUM = ["RED", "BLACK", "YELLOW", "WHITE", "BROWN"];
const COUNTRY_ENUM = ["FRANCE", "SPAIN", "VATICAN", "ITALY", "NORTH_KOREA"];

const getApi = new GetApi(apiConfig);
const createApi = new DragonApi(apiConfig);

const Dragons = () => {
    const token = useSelector((state) => state.auth.token);


    const [data, setData] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form] = Form.useForm();


    const nameSearchInputRef = useRef(null);
    const xSearchInputRef = useRef(null);
    const ySearchInputRef = useRef(null);
    const depthSearchInputRef = useRef(null);
    const treasuresSearchInputRef = useRef(null);


    const [caves, setCaves] = useState([]);
    const [persons, setPersons] = useState([]);
    const [heads, setHeads] = useState([]);
    const [coordsList, setCoordsList] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loadingRefs, setLoadingRefs] = useState(false);


    const [notices, setNotices] = useState([]);
    const timersRef = useRef({});

    const removeNotice = (id) => {
        setNotices((prev) => prev.filter((n) => n.id !== id));
        if (timersRef.current[id]) {
            clearTimeout(timersRef.current[id]);
            delete timersRef.current[id];
        }
    };

    const notify = (type, content, durationMs = 5000) => {
        const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
        setNotices((prev) => [...prev, { id, type, content }]);
        if (durationMs > 0) {
            const t = setTimeout(() => removeNotice(id), durationMs);
            timersRef.current[id] = t;
        }
    };

    useEffect(() => {
        return () => {
            Object.values(timersRef.current).forEach(clearTimeout);
            timersRef.current = {};
        };
    }, []);


    const authHeader = { Authorization: `Bearer ${token}` };

    const loadRefs = async () => {
        setLoadingRefs(true);
        try {
            const entries = [
                ["caves", await getApi.getCaves({headers: authHeader})],
                ["persons", await getApi.getPersons({headers: authHeader})],
                ["heads", await getApi.getHeads({headers: authHeader})],
                ["coords", await getApi.getCoordinates({headers: authHeader})],
                ["locations", await getApi.getLocations({headers: authHeader})],
            ];

            const settled = await Promise.allSettled(entries.map(([, p]) => p));

            const results = {};
            const failed = [];

            for (let i = 0; i < entries.length; i++) {
                const key = entries[i][0];
                const res = settled[i];

                if (res.status === "fulfilled") {
                    const payload =
                        res.value && res.value.data !== undefined ? res.value.data : res.value;
                    results[key] = Array.isArray(payload) ? payload : [];
                } else {
                    results[key] = [];
                    failed.push(key);
                }
            }

            setCaves(results.caves);
            setPersons(results.persons);
            setHeads(results.heads);
            setCoordsList(results.coords);
            setLocations(results.locations);

            if (failed.length > 0) {
                notify("warning", `Часть справочников не загрузилась: ${failed.join(", ")}`);
            } else {
                notify("success", "Справочники загружены");
            }
        } catch (_e) {
            notify("error", "Не удалось загрузить справочники (неожиданная ошибка)");
            setCaves([]);
            setPersons([]);
            setHeads([]);
            setCoordsList([]);
            setLocations([]);
        } finally {
            setLoadingRefs(false);
        }
    };


    const [modeCave, setModeCave] = useState("choose");
    const [modeKiller, setModeKiller] = useState("none");
    const [modeHead, setModeHead] = useState("choose");
    const [modeCoords, setModeCoords] = useState("choose");
    const [modeKillerLocation, setModeKillerLocation] = useState("choose");

    const openCreateModal = async () => {
        setIsModalOpen(true);
        form.resetFields();
        setModeCave("choose");
        setModeKiller("none");
        setModeHead("choose");
        setModeCoords("choose");
        setModeKillerLocation("choose");
        await loadRefs();
    };
    const requiredNonEmptyString = (_, v) =>
        v && String(v).trim().length > 0
            ? Promise.resolve()
            : Promise.reject(new Error("Строка не может быть пустой"));


    const handleSaveClick = async () => {
        try {
            const values = await form.validateFields();

            let coordinatesPayload = null;
            if (modeCoords === "choose") {
                if (values.coordinatesExistingId == null) {
                    throw new Error("Выбери существующие координаты или переключись на создание новых");
                }
                coordinatesPayload = { id: Number(values.coordinatesExistingId) };
            } else {
                const x = values.coordX;
                const y = values.coordY;
                if (x === undefined || x === null || y === undefined || y === null) {
                    throw new Error("Укажи X и Y для координат");
                }
                coordinatesPayload = { x: Number(x), y: Number(y) };
            }

            let cavePayload = null;
            if (modeCave === "choose") {
                cavePayload = values.caveExistingId != null ? { id: Number(values.caveExistingId) } : null;
            } else {
                const num = values.caveCreateNumberOfTreasures;
                cavePayload = {
                    numberOfTreasures:
                        num === undefined || num === null || num === "" ? null : Number(num),
                };
            }

            let killerPayload = null;
            if (modeKiller === "choose") {
                killerPayload = values.killerExistingId != null ? { id: Number(values.killerExistingId) } : null;
            } else if (modeKiller === "create") {
                let locationPayload = null;
                if (modeKillerLocation === "choose") {
                    if (values.killerLocationExistingId == null) {
                        throw new Error("Для убийцы выбери локацию или переключись на создание новой");
                    }
                    locationPayload = { id: Number(values.killerLocationExistingId) };
                } else {
                    const lx = values.locX;
                    const ly = values.locY;
                    const lz = values.locZ;
                    if (lx === undefined || lx === null || ly === undefined || ly === null || lz === undefined || lz === null) {
                        throw new Error("Для новой локации убийцы укажи x, y и z");
                    }
                    locationPayload = {
                        x: Number(lx),
                        y: Number(ly),
                        z: Number(lz),
                        name: values.locName ?? null,
                    };
                }

                killerPayload = {
                    name: values.killerName,
                    eyeColor: values.killerEyeColor,
                    hairColor: values.killerHairColor ?? null,
                    location: locationPayload,
                    passportID: values.killerPassportID,
                    nationality: values.killerNationality,
                };
            }


            let headPayload = null;
            if (modeHead === "choose") {
                headPayload = values.headExistingId != null ? { id: Number(values.headExistingId) } : null;
            } else {
                headPayload = {
                    size: Number(values.headSize),
                    eyesCount: Number(values.headEyesCount),
                    toothCount: Number(values.headToothCount),
                };
            }

            const payload = {
                name: values.name,
                coordinates: coordinatesPayload,
                cave: cavePayload,
                killer: killerPayload,
                age: Number(values.age),
                description: values.description,
                wingspan:
                    values.wingspan === undefined || values.wingspan === null || values.wingspan === ""
                        ? null
                        : Number(values.wingspan),
                type: values.type || null,
                head: headPayload,
            };

            setCreating(true);
            await createApi.createDragon(payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            notify("success", "Дракон добавлен");
            setIsModalOpen(false);
            form.resetFields();
        } catch (e) {
            const msg = e?.message || "Не удалось сохранить";
            notify("error", `Не удалось сохранить: ${msg}`);
        } finally {
            setCreating(false);
        }
    };

    return (
        <Layout className="dragons-layout">
            <Content className="dragons-content">
                <div className="dragons-container">
                    <div className="dragons-topbar">
                        <Title level={4} className="dragons-subtitle">
                            Объекты: Драконы
                        </Title>
                        <Space>
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                onClick={openCreateModal}
                            >
                                Добавить объект
                            </Button>
                        </Space>
                    </div>

                    <div className="dragons-table-wrapper">
                        <DragonTable />
                    </div>
                </div>
            </Content>

            <Modal
                title="Добавить дракона"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSaveClick}
                okText="Сохранить"
                cancelText="Отмена"
                confirmLoading={creating}
                destroyOnClose
                className="dragons-modal"
            >
                <Form
                    form={form}
                    layout="vertical"
                    requiredMark="optional"
                    className="dragons-form"
                >
                    {/* 1) Имя дракона */}
                    <Form.Item
                        name="name"
                        label="Имя дракона"
                        rules={[
                            { required: true, message: "Укажи имя дракона" },
                            {
                                validator: (_, v) =>
                                    v && String(v).trim().length > 0
                                        ? Promise.resolve()
                                        : Promise.reject(new Error("Строка не может быть пустой")),
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    {/* 2) Coordinates: choose | create */}
                    <Divider className="dragons-divider">Координаты (обязательные)</Divider>
                    <div className="dragons-segment-row">
                        <span className="dragons-segment-label">Режим координат:</span>
                        <Segmented
                            value={modeCoords}
                            onChange={setModeCoords}
                            options={[
                                { label: "Выбрать существующие", value: "choose" },
                                { label: "Создать новые", value: "create" },
                            ]}
                        />
                    </div>

                    {modeCoords === "choose" ? (
                        <Form.Item
                            name="coordinatesExistingId"
                            label="Существующие координаты"
                            rules={[{ required: true, message: "Выбери координаты" }]}
                        >
                            <Select
                                loading={loadingRefs}
                                options={coordsList.map((c) => ({
                                    label: `#${c.id} — x: ${c.x}, y: ${c.y}`,
                                    value: c.id,
                                }))}
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    ) : (
                        <>
                            <Form.Item
                                name="coordX"
                                label="X (Float, обяз.)"
                                rules={[
                                    { required: true, message: "Укажи X" },
                                    {
                                        validator: (_, v) =>
                                            v === 0 || v
                                                ? Promise.resolve()
                                                : Promise.reject(new Error("Значение обязательно")),
                                    },
                                ]}
                            >
                                <InputNumber className="dragons-input-number" step={0.01} />
                            </Form.Item>
                            <Form.Item
                                name="coordY"
                                label="Y (Double, обяз.)"
                                rules={[
                                    { required: true, message: "Укажи Y" },
                                    {
                                        validator: (_, v) =>
                                            v === 0 || v
                                                ? Promise.resolve()
                                                : Promise.reject(new Error("Значение обязательно")),
                                    },
                                ]}
                            >
                                <InputNumber className="dragons-input-number" step={0.000001} />
                            </Form.Item>
                        </>
                    )}

                    {/* 3) Пещера */}
                    <Divider className="dragons-divider">Пещера (обязательное поле)</Divider>
                    <div className="dragons-segment-row">
                        <span className="dragons-segment-label">Режим пещеры:</span>
                        <Segmented
                            value={modeCave}
                            onChange={setModeCave}
                            options={[
                                { label: "Выбрать существующую", value: "choose" },
                                { label: "Создать новую", value: "create" },
                            ]}
                        />
                    </div>

                    {modeCave === "choose" ? (
                        <Form.Item
                            name="caveExistingId"
                            label="Существующая пещера"
                            rules={[{ required: true, message: "Выбери пещеру" }]}
                        >
                            <Select
                                loading={loadingRefs}
                                options={caves.map((c) => ({
                                    label: `#${c.id} — treasures: ${c.numberOfTreasures ?? "—"} `,
                                    value: c.id,
                                }))}
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    ) : (
                        <Form.Item
                            name="caveCreateNumberOfTreasures"
                            label="numberOfTreasures (> 0, можно пусто)"
                            rules={[
                                {
                                    validator: (_, v) => {
                                        if (v === undefined || v === null || v === "") return Promise.resolve();
                                        return Number(v) > 0
                                            ? Promise.resolve()
                                            : Promise.reject(new Error("Если указано — должно быть > 0"));
                                    },
                                },
                            ]}
                        >
                            <InputNumber className="dragons-input-number" min={0} />
                        </Form.Item>
                    )}

                    {/* 4) Убийца */}
                    <Divider className="dragons-divider">Убийца (может быть пусто)</Divider>
                    <div className="dragons-segment-row">
                        <span className="dragons-segment-label">Режим убийцы:</span>
                        <Segmented
                            value={modeKiller}
                            onChange={(val) => {
                                setModeKiller(val);
                                if (val !== "create") {
                                    setModeKillerLocation("choose");
                                }
                            }}
                            options={[
                                { label: "Нет", value: "none" },
                                { label: "Выбрать", value: "choose" },
                                { label: "Создать", value: "create" },
                            ]}
                        />
                    </div>

                    {modeKiller === "choose" && (
                        <Form.Item
                            name="killerExistingId"
                            label="Существующий человек"
                            rules={[{ required: true, message: "Выбери человека" }]}
                        >
                            <Select
                                loading={loadingRefs}
                                options={persons.map((p) => ({
                                    label: `#${p.id} — Имя: ${p.name} / Национальность: ${p.nationality} ${
                                        p.location
                                            ? ` / loc: ${p.location.name} x=${p.location.x}, y=${p.location.y}, z=${p.location.z}${
                                                p.location.name ? `` : ""
                                            }`
                                            : ""
                                    }`,
                                    value: p.id,
                                }))}
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    )}

                    {modeKiller === "create" && (
                        <>
                            <Form.Item
                                name="killerName"
                                label="Имя"
                                rules={[
                                    { required: true, message: "Укажи имя" },
                                    { validator: requiredNonEmptyString },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="killerEyeColor"
                                label="Цвет глаз"
                                rules={[{ required: true, message: "Выбери цвет глаз" }]}
                            >
                                <Select options={COLOR_ENUM.map((c) => ({ label: c, value: c }))} />
                            </Form.Item>

                            <Form.Item name="killerHairColor" label="Цвет волос (может быть пусто)">
                                <Select allowClear options={COLOR_ENUM.map((c) => ({ label: c, value: c }))} />
                            </Form.Item>

                            <Form.Item
                                name="killerPassportID"
                                label="Паспорт"
                                rules={[
                                    { required: true, message: "Укажи паспорт" },
                                    { validator: requiredNonEmptyString },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="killerNationality"
                                label="Гражданство"
                                rules={[{ required: true, message: "Выбери гражданство" }]}
                            >
                                <Select options={COUNTRY_ENUM.map((c) => ({ label: c, value: c }))} />
                            </Form.Item>

                            {/* ---- Location for Killer: choose | create ---- */}
                            <Divider className="dragons-divider">Локация убийцы (обязательна)</Divider>
                            <div className="dragons-segment-row">
                                <span className="dragons-segment-label">Режим локации:</span>
                                <Segmented
                                    value={modeKillerLocation}
                                    onChange={setModeKillerLocation}
                                    options={[
                                        { label: "Выбрать существующую", value: "choose" },
                                        { label: "Создать новую", value: "create" },
                                    ]}
                                />
                            </div>

                            {modeKillerLocation === "choose" ? (
                                <Form.Item
                                    name="killerLocationExistingId"
                                    label="Существующая локация"
                                    rules={[{ required: true, message: "Выбери локацию" }]}
                                >
                                    <Select
                                        loading={loadingRefs}
                                        options={locations.map((l) => ({
                                            label: `#${l.id} — x:${l.x}, y:${l.y}, z:${l.z}${l.name ? `, ${l.name}` : ""}`,
                                            value: l.id,
                                        }))}
                                        showSearch
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            ) : (
                                <>
                                    <Form.Item
                                        name="locX"
                                        label="x (Float, обяз.)"
                                        rules={[
                                            { required: true, message: "Укажи x" },
                                            {
                                                validator: (_, v) =>
                                                    v === 0 || v
                                                        ? Promise.resolve()
                                                        : Promise.reject(new Error("Значение обязательно")),
                                            },
                                        ]}
                                    >
                                        <InputNumber className="dragons-input-number" step={0.01} />
                                    </Form.Item>

                                    <Form.Item
                                        name="locY"
                                        label="y (float, обяз.)"
                                        rules={[
                                            { required: true, message: "Укажи y" },
                                            {
                                                validator: (_, v) =>
                                                    v === 0 || v
                                                        ? Promise.resolve()
                                                        : Promise.reject(new Error("Значение обязательно")),
                                            },
                                        ]}
                                    >
                                        <InputNumber className="dragons-input-number" step={0.01} />
                                    </Form.Item>

                                    <Form.Item
                                        name="locZ"
                                        label="z (Integer, обяз.)"
                                        rules={[
                                            { required: true, message: "Укажи z" },
                                            {
                                                validator: (_, v) =>
                                                    v === 0 || v
                                                        ? Promise.resolve()
                                                        : Promise.reject(new Error("Значение обязательно")),
                                            },
                                        ]}
                                    >
                                        <InputNumber className="dragons-input-number" precision={0} />
                                    </Form.Item>

                                    <Form.Item name="locName" label="name (может быть пусто)">
                                        <Input />
                                    </Form.Item>
                                </>
                            )}
                        </>
                    )}

                    {/* 5) Возраст */}
                    <Divider className="dragons-divider">Характеристики дракона</Divider>
                    <Form.Item
                        name="age"
                        label="Возраст (> 0)"
                        rules={[
                            { required: true, message: "Укажи возраст" },
                            {
                                validator: (_, v) =>
                                    Number(v) > 0
                                        ? Promise.resolve()
                                        : Promise.reject(new Error("Значение должно быть > 0")),
                            },
                        ]}
                    >
                        <InputNumber className="dragons-input-number" min={1} precision={0} />
                    </Form.Item>

                    {/* 6) Описание */}
                    <Form.Item
                        name="description"
                        label="Описание"
                        rules={[{ required: true, message: "Добавь описание" }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    {/* 7) Размах крыльев */}
                    <Form.Item
                        name="wingspan"
                        label="Размах крыльев (> 0, можно пусто)"
                        rules={[
                            {
                                validator: (_, v) => {
                                    if (v === undefined || v === null || v === "") return Promise.resolve();
                                    return Number(v) > 0
                                        ? Promise.resolve()
                                        : Promise.reject(new Error("Если указано — только > 0"));
                                },
                            },
                        ]}
                    >
                        <InputNumber className="dragons-input-number" min={0} />
                    </Form.Item>

                    {/* 8) Тип */}
                    <Form.Item name="type" label="Тип (enum, можно пусто)">
                        <Select
                            allowClear
                            options={DRAGON_TYPES.map((t) => ({ label: t, value: t }))}
                            placeholder="Не выбран"
                        />
                    </Form.Item>

                    {/* 9) Голова */}
                    <Divider className="dragons-divider">Голова дракона</Divider>
                    <div className="dragons-segment-row">
                        <span className="dragons-segment-label">Режим головы:</span>
                        <Segmented
                            value={modeHead}
                            onChange={setModeHead}
                            options={[
                                { label: "Выбрать существующую", value: "choose" },
                                { label: "Создать новую", value: "create" },
                            ]}
                        />
                    </div>

                    {modeHead === "choose" ? (
                        <Form.Item
                            name="headExistingId"
                            label="Существующая голова"
                            rules={[{ required: true, message: "Выбери голову" }]}
                        >
                            <Select
                                loading={loadingRefs}
                                options={heads.map((h) => ({
                                    label: `#${h.id} — size: ${h.size}, eyes: ${h.eyesCount}, teeth: ${h.toothCount}`,
                                    value: h.id,
                                }))}
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    ) : (
                        <>
                            <Form.Item
                                name="headSize"
                                label="size (целое > 0)"
                                rules={[
                                    { required: true, message: "Укажи size" },
                                    {
                                        validator: (_, v) =>
                                            Number(v) > 0
                                                ? Promise.resolve()
                                                : Promise.reject(new Error("Должно быть > 0")),
                                    },
                                ]}
                            >
                                <InputNumber className="dragons-input-number" min={1} precision={0} />
                            </Form.Item>
                            <Form.Item
                                name="headEyesCount"
                                label="eyesCount (целое > 0)"
                                rules={[
                                    { required: true, message: "Укажи eyesCount" },
                                    {
                                        validator: (_, v) =>
                                            Number(v) > 0
                                                ? Promise.resolve()
                                                : Promise.reject(new Error("Должно быть > 0")),
                                    },
                                ]}
                            >
                                <InputNumber className="dragons-input-number" min={1} precision={0} />
                            </Form.Item>
                            <Form.Item
                                name="headToothCount"
                                label="toothCount (целое > 0)"
                                rules={[
                                    { required: true, message: "Укажи toothCount" },
                                    {
                                        validator: (_, v) =>
                                            Number(v) > 0
                                                ? Promise.resolve()
                                                : Promise.reject(new Error("Должно быть > 0")),
                                    },
                                ]}
                            >
                                <InputNumber className="dragons-input-number" min={1} precision={0} />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>

            {/* Панель уведомлений внизу страницы */}
            <div style={{ padding: "0 24px 24px" }}>
                {notices.length > 0 && (
                    <Card size="small" title={`Уведомления (${notices.length})`}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                            {notices.map((n) => (
                                <Alert
                                    key={n.id}
                                    type={n.type}
                                    message={n.content}
                                    showIcon
                                    closable
                                    onClose={() => removeNotice(n.id)}
                                />
                            ))}
                        </Space>
                    </Card>
                )}
            </div>
        </Layout>
    );
};

export default Dragons;
