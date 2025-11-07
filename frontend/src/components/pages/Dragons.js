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
    Upload,
    Tag,
} from "antd";

import {
    CloudDownloadOutlined,
    CloudUploadOutlined,
    PlusOutlined,
    InboxOutlined,
    FileTextOutlined,
    CheckCircleTwoTone,
    CloseCircleTwoTone,
    DeleteOutlined,
} from "@ant-design/icons";
import "../../styles/dragons.css";
import { useSelector } from "react-redux";
import DragonTable from "../DragonTable";
import logo from "../../styles/Снимок экрана 2025-11-06 в 21.35.05.png";

import { GetApi, DragonApi } from "../../api";
import { apiConfig } from "../../apiConfig";
import axios from "axios";

const { Content } = Layout;
const { Title } = Typography;

const DRAGON_TYPES = ["WATER", "UNDERGROUND", "AIR", "FIRE"];
const COLOR_ENUM = ["RED", "BLACK", "YELLOW", "WHITE", "BROWN"];
const COUNTRY_ENUM = ["FRANCE", "SPAIN", "VATICAN", "ITALY", "NORTH_KOREA"];

const getApi = new GetApi(apiConfig);
const createApi = new DragonApi(apiConfig);
const getDragonApi = new DragonApi(apiConfig);

const Dragons = () => {
    const token = useSelector((state) => state.auth.token);

    // ---------------------- уведомления ----------------------
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

    // ---------------------- экспорт (скачивание JSON) ----------------------
    async function handleDownload() {
        try {
            const { data: response } = await getDragonApi.getDragons({
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const jsonString = JSON.stringify(response, null, 4);
            const blob = new Blob([jsonString], {
                type: "application/json;charset=utf-8",
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");

            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            a.href = url;
            a.download = `dragons-${timestamp}.json`;

            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            notify("success", "Таблица загружена");
        } catch {
            notify("error", "Таблица не загружена");
        }
    }

    const [open, setOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const [jsonText, setJsonText] = useState("");
    const [fileName, setFileName] = useState("");

    const isValidJson = useMemo(() => {
        try {
            JSON.parse(jsonText);
            return jsonText.trim().length > 0;
        } catch {
            return false;
        }
    }, [jsonText]);

    function handleOpen() {
        setOpen(true);
    }
    function handleCancel() {
        if (!sending) {
            setOpen(false);
            setJsonText("");
            setFileName("");
        }
    }
    async function handleBeforeUpload(file) {
        try {
            const text = await file.text();
            setJsonText(text);
            setFileName(file.name);
            if (text.trim().length === 0) {
                notify("warning", "Файл пустой");
            } else {
                try {
                    JSON.parse(text);
                    notify("success", "JSON загружен и валиден");
                } catch {
                    notify("error", "Невалидный JSON — исправьте вручную или выберите другой файл");
                }
            }
        } catch {
            notify("error", "Не удалось прочитать файл");
        }
        return false;
    }
    function handleRemove() {
        setJsonText("");
        setFileName("");
        return true;
    }

    async function handleSend() {
        setSending(true);
        try {
            const text = jsonText.trim();
            if (!text) throw new Error("Пустой ввод.");

            try {
                JSON.parse(text);
            } catch {
                throw new Error("Невалидный JSON. Проверьте содержимое.");
            }

            await axios.post(
                "/import/dragons",
                { dragonsJson: text },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            notify("success", "Импорт выполнен успешно");

            setJsonText("");
            setFileName("");
        } catch (e) {
            const msg = e.response
                ? `Ошибка ${e.response.status}: ${
                    typeof e.response.data === "string"
                        ? e.response.data
                        : JSON.stringify(e.response.data)
                }`
                : e.message;
            notify("error", msg);
        } finally {
            setSending(false);
            setOpen(false);
        }
    }

    // ---------------------- справочники + создание дракона ----------------------
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form] = Form.useForm();

    const [caves, setCaves] = useState([]);
    const [persons, setPersons] = useState([]);
    const [coordsList, setCoordsList] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loadingRefs, setLoadingRefs] = useState(false);

    const authHeader = { Authorization: `Bearer ${token}` };

    const total4K = async () => {
        await axios.delete("/dragonsTotal4k", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    };

    const loadRefs = async () => {
        setLoadingRefs(true);
        try {
            const entries = [
                ["caves", await getApi.getCaves({ headers: authHeader })],
                ["persons", await getApi.getPersons({ headers: authHeader })],
                ["coords", await getApi.getCoordinates({ headers: authHeader })],
                ["locations", await getApi.getLocations({ headers: authHeader })],
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
            setCoordsList(results.coords);
            setLocations(results.locations);

            if (failed.length > 0) {
                notify("warning", `Часть справочников не загрузилась: ${failed.join(", ")}`);
            } else {
                notify("success", "Справочники загружены");
            }
        } catch {
            notify("error", "Не удалось загрузить справочники (неожиданная ошибка)");
            setCaves([]);
            setPersons([]);
            setCoordsList([]);
            setLocations([]);
        } finally {
            setLoadingRefs(false);
        }
    };

    const [modeCave, setModeCave] = useState("choose");
    const [modeKiller, setModeKiller] = useState("none");
    const [modeCoords, setModeCoords] = useState("choose");
    const [modeKillerLocation, setModeKillerLocation] = useState("choose");

    const openCreateModal = async () => {
        setIsModalOpen(true);
        form.resetFields();
        setModeCave("choose");
        setModeKiller("none");
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
                cavePayload =
                    values.caveExistingId != null ? { id: Number(values.caveExistingId) } : null;
            } else {
                const num = values.caveCreateNumberOfTreasures;
                cavePayload = {
                    numberOfTreasures:
                        num === undefined || num === null || num === "" ? null : Number(num),
                };
            }

            let killerPayload = null;
            if (modeKiller === "choose") {
                killerPayload =
                    values.killerExistingId != null ? { id: Number(values.killerExistingId) } : null;
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
                    if (
                        lx === undefined ||
                        lx === null ||
                        ly === undefined ||
                        ly === null ||
                        lz === undefined ||
                        lz === null
                    ) {
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

            // Всегда создаём НОВУЮ голову
            const headPayload = {
                size: Number(values.headSize),
                eyesCount: Number(values.headEyesCount),
                toothCount: Number(values.headToothCount),
            };

            const payload = {
                name: values.name,
                coordinates: coordinatesPayload,
                cave: cavePayload,
                killer: killerPayload,
                age: Number(values.age),
                description: values.description,
                wingspan:
                    values.wingspan === undefined ||
                    values.wingspan === null ||
                    values.wingspan === ""
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
        } catch (e) {
            const msg = e.response
                ? `Ошибка ${e.response.status}: ${
                    typeof e.response.data === "string"
                        ? e.response.data
                        : JSON.stringify(e.response.data)
                }`
                : e.message;
            notify("error", msg);
        } finally {
            setCreating(false);
            form.resetFields();
            setIsModalOpen(false);
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
                            <Button
                                color="blue"
                                variant="filled"
                                size="large"
                                icon={<CloudDownloadOutlined />}
                                onClick={handleDownload}
                            >
                                Экспорт объектов
                            </Button>
                            <Button
                                color="blue"
                                variant="dashed"
                                size="large"
                                icon={<CloudUploadOutlined />}
                                onClick={handleOpen}
                            >
                                Импорт объектов
                            </Button>
                            <Button
                                type="primary"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={total4K}
                            >
                                Тотальная аннигиляция
                            </Button>
                        </Space>
                    </div>

                    <div className="dragons-table-wrapper">
                        <DragonTable />
                    </div>
                </div>
            </Content>

            {/* ---------- МОДАЛКА ИМПОРТА JSON ---------- */}
            <Modal
                title={
                    <Space align="center">
                        <FileTextOutlined />
                        <span>Импорт JSON в /api/import/dragons</span>
                    </Space>
                }
                open={open}
                onCancel={handleCancel}
                footer={null}
                maskClosable={!sending}
                destroyOnClose
            >
                <Form layout="vertical" onFinish={handleSend}>
                    <Form.Item label="Файл JSON (перетащите или выберите)">
                        <Upload.Dragger
                            name="file"
                            multiple={false}
                            maxCount={1}
                            accept=".json,application/json"
                            beforeUpload={handleBeforeUpload}
                            onRemove={handleRemove}
                            disabled={sending}
                            showUploadList={Boolean(fileName)}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Перетащите сюда .json или кликните для выбора</p>
                            <p className="ant-upload-hint">
                                Файл не отправляется автоматически — содержимое можно отредактировать ниже.
                            </p>
                        </Upload.Dragger>
                        {fileName && (
                            <div style={{ marginTop: 8 }}>
                                <Tag icon={<FileTextOutlined />} color="blue">
                                    {fileName}
                                </Tag>
                            </div>
                        )}
                    </Form.Item>

                    <Form.Item
                        label={
                            <Space>
                                <span>Содержимое JSON</span>
                                {isValidJson ? (
                                    <>
                                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                                        <Typography.Text type="success">валиден</Typography.Text>
                                    </>
                                ) : (
                                    <>
                                        <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                                        <Typography.Text type="danger">невалиден</Typography.Text>
                                    </>
                                )}
                            </Space>
                        }
                    >
                        <Input.TextArea
                            value={jsonText}
                            onChange={(e) => setJsonText(e.target.value)}
                            placeholder="Вставьте JSON сюда или загрузите файл"
                            autoSize={{ minRows: 8, maxRows: 16 }}
                            disabled={sending}
                            spellCheck={false}
                        />
                    </Form.Item>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button onClick={handleCancel} disabled={sending}>
                            Отмена
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={sending}
                            disabled={!isValidJson || sending || jsonText.trim() === ""}
                        >
                            Отправить на сервер
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* ---------- МОДАЛКА СОЗДАНИЯ ДРАКОНА ---------- */}
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
                <Form form={form} layout="vertical" requiredMark="optional" className="dragons-form">
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

                    <Divider className="dragons-divider">Координаты (обязательные)</Divider>
                    <img alt="Логотип" src={logo} className="logo" />
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

                    {/* 5) Характеристики */}
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

                    <Form.Item
                        name="description"
                        label="Описание"
                        rules={[{ required: true, message: "Добавь описание" }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

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

                    <Form.Item name="type" label="Тип (enum, можно пусто)">
                        <Select
                            allowClear
                            options={DRAGON_TYPES.map((t) => ({ label: t, value: t }))}
                            placeholder="Не выбран"
                        />
                    </Form.Item>

                    {/* 6) Голова — только создание новой */}
                    <Divider className="dragons-divider">Голова дракона</Divider>
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
                </Form>
            </Modal>

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
