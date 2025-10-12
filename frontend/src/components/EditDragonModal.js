
import React, { useEffect, useState } from "react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    message,
    Segmented,
    Divider,
    Button,
    Spin,
    Typography
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

import { GetApi, DragonApi } from "../api";
import { apiConfig } from "../apiConfig";

const { Text } = Typography;

/** ===== Enums ===== */
const DRAGON_TYPES = ["WATER", "UNDERGROUND", "AIR", "FIRE"];
const COLOR_ENUM = ["RED", "BLACK", "YELLOW", "WHITE", "BROWN"];
const COUNTRY_ENUM = ["FRANCE", "SPAIN", "VATICAN", "ITALY", "NORTH_KOREA"];

const getApi = new GetApi(apiConfig);
const updateApi = new DragonApi(apiConfig);

const EditDragonModal = ({ dragon, visible, onCancel, onSuccess }) => {
    const token = useSelector((state) => state.auth.token);
    const [form] = Form.useForm();
    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(false);


    const [caves, setCaves] = useState([]);
    const [persons, setPersons] = useState([]);
    const [heads, setHeads] = useState([]);
    const [coordsList, setCoordsList] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loadingRefs, setLoadingRefs] = useState(false);

    const [modeCave, setModeCave] = useState("choose");
    const [modeKiller, setModeKiller] = useState("none");
    const [modeHead, setModeHead] = useState("choose");
    const [modeCoords, setModeCoords] = useState("choose");
    const [modeKillerLocation, setModeKillerLocation] = useState("choose");

    const authHeaders = { Authorization: `Bearer ${token}` };

    const loadRefs = async () => {
        setLoadingRefs(true);
        try {
            const jobs = [
                ["caves", await getApi.getCaves({headers: authHeaders})],
                ["persons", await getApi.getPersons({headers: authHeaders})],
                ["heads", await getApi.getHeads({headers: authHeaders})],
                ["coords", await getApi.getCoordinates({headers: authHeaders})],
                ["locations", await getApi.getLocations({headers: authHeaders})],
            ];

            const settled = await Promise.allSettled(jobs.map(([, p]) => p));
            const result = { caves: [], persons: [], heads: [], coords: [], locations: [] };

            settled.forEach((res, idx) => {
                const key = jobs[idx][0];
                if (res.status === "fulfilled") {
                    const payload = res.value?.data !== undefined ? res.value.data : res.value;
                    result[key] = Array.isArray(payload) ? payload : [];
                } else {
                    console.error(`Failed to load ${key}:`, res.reason);
                }
            });

            setCaves(result.caves);
            setPersons(result.persons);
            setHeads(result.heads);
            setCoordsList(result.coords);
            setLocations(result.locations);
        } catch (e) {
            console.error("Error loading references:", e);
            message.error("Не удалось загрузить справочники");
            setCaves([]);
            setPersons([]);
            setHeads([]);
            setCoordsList([]);
            setLocations([]);
        } finally {
            setLoadingRefs(false);
        }
    };

    // Заполнение формы данными дракона
    const fillFormWithDragonData = () => {
        if (!dragon) return;

        // Режимы по наличию связанных сущностей
        setModeCoords(dragon.coordinates ? "choose" : "create");
        setModeCave(dragon.cave ? "choose" : "create");
        setModeKiller(dragon.killer ? "choose" : "none");
        setModeHead(dragon.head ? "choose" : "create");
        if (dragon.killer) {
            setModeKillerLocation(dragon.killer.location ? "choose" : "create");
        }

        form.setFieldsValue({

            name: dragon.name,
            age: dragon.age,
            description: dragon.description,
            wingspan: dragon.wingspan,
            type: dragon.type,


            coordinatesExistingId: dragon.coordinates?.id,
            coordX: dragon.coordinates?.x,
            coordY: dragon.coordinates?.y,


            caveExistingId: dragon.cave?.id,
            caveCreateNumberOfTreasures: dragon.cave?.numberOfTreasures,


            killerExistingId: dragon.killer?.id,
            killerName: dragon.killer?.name,
            killerEyeColor: dragon.killer?.eyeColor,
            killerHairColor: dragon.killer?.hairColor,
            killerPassportID: dragon.killer?.passportID,
            killerNationality: dragon.killer?.nationality,


            killerLocationExistingId: dragon.killer?.location?.id,
            locX: dragon.killer?.location?.x,
            locY: dragon.killer?.location?.y,
            locZ: dragon.killer?.location?.z,
            locName: dragon.killer?.location?.name,

            // Голова
            headExistingId: dragon.head?.id,
            headSize: dragon.head?.size,
            headEyesCount: dragon.head?.eyesCount,
            headToothCount: dragon.head?.toothCount,
        });
    };

    useEffect(() => {
        if (visible && dragon) {
            setLoading(true);
            loadRefs()
                .catch(() => {}) // сообщение об ошибке уже показано в loadRefs
                .finally(() => {
                    setLoading(false);
                    fillFormWithDragonData();
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, dragon]);

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            setUpdating(true);

            // --- coordinates ---
            let coordinatesPayload = null;
            if (modeCoords === "choose") {
                coordinatesPayload = { id: Number(values.coordinatesExistingId) };
            } else {
                coordinatesPayload = {
                    x: Number(values.coordX),
                    y: Number(values.coordY)
                };
            }

            // --- cave ---
            let cavePayload = null;
            if (modeCave === "choose") {
                cavePayload = values.caveExistingId ? { id: Number(values.caveExistingId) } : null;
            } else {
                cavePayload = {
                    numberOfTreasures:
                        values.caveCreateNumberOfTreasures !== undefined &&
                        values.caveCreateNumberOfTreasures !== null &&
                        values.caveCreateNumberOfTreasures !== ""
                            ? Number(values.caveCreateNumberOfTreasures)
                            : null
                };
            }

            // --- killer + killer.location ---
            let killerPayload = null;
            if (modeKiller === "choose") {
                killerPayload = values.killerExistingId ? { id: Number(values.killerExistingId) } : null;
            } else if (modeKiller === "create") {
                let locationPayload = null;
                if (modeKillerLocation === "choose") {
                    locationPayload = { id: Number(values.killerLocationExistingId) };
                } else {
                    locationPayload = {
                        x: Number(values.locX),
                        y: Number(values.locY),
                        z: Number(values.locZ),
                        name: values.locName || null,
                    };
                }

                killerPayload = {
                    name: values.killerName,
                    eyeColor: values.killerEyeColor,
                    hairColor: values.killerHairColor || null,
                    location: locationPayload,
                    passportID: values.killerPassportID,
                    nationality: values.killerNationality,
                };
            }

            // --- head ---
            let headPayload = null;
            if (modeHead === "choose") {
                headPayload = values.headExistingId ? { id: Number(values.headExistingId) } : null;
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
                    values.wingspan !== undefined && values.wingspan !== null && values.wingspan !== ""
                        ? Number(values.wingspan)
                        : null,
                type: values.type || null,
                head: headPayload,
            };

            await updateApi.updateDragonById(
                Number(dragon.id),
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            message.success("Дракон успешно обновлён");
            onSuccess && onSuccess();
            onCancel && onCancel();
        } catch (error) {
            // Если ошибка валидации antd — не перекрываем стандартные подсказки
            if (error?.errorFields) return;
            console.error("Update error:", error);
            const errMsg =
                error?.response?.data?.message ??
                (typeof error?.response?.data === "string" ? error.response.data : null) ??
                error?.message ??
                "Ошибка обновления";
            message.error(`Ошибка обновления: ${errMsg}`);
        } finally {
            setUpdating(false);
        }
    };

    const requiredNonEmptyString = (_, v) =>
        v && String(v).trim().length > 0
            ? Promise.resolve()
            : Promise.reject(new Error("Строка не может быть пустой"));

    if (loading) {
        return (
            <Modal title="Редактирование дракона" open={visible} onCancel={onCancel} footer={null}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 10 }}>Загрузка данных...</div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            title={
                <Space>
                    <EditOutlined />
                    Редактирование дракона: {dragon?.name}
                </Space>
            }
            open={visible}
            onCancel={onCancel}
            width={800}
            style={{ top: 20 }}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Отмена
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={updating}
                    onClick={handleUpdate}
                >
                    Обновить
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark="optional"
                style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 10 }}
            >

                <Form.Item
                    name="name"
                    label="Имя дракона"
                    rules={[
                        { required: true, message: "Укажи имя дракона" },
                        { validator: requiredNonEmptyString },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Divider>Координаты (обязательные)</Divider>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ marginRight: 16 }}>Режим координат:</span>
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
                            rules={[{ required: true, message: "Укажи X" }]}
                        >
                            <InputNumber style={{ width: '100%' }} step={0.01} />
                        </Form.Item>
                        <Form.Item
                            name="coordY"
                            label="Y (Double, обяз.)"
                            rules={[{ required: true, message: "Укажи Y" }]}
                        >
                            <InputNumber style={{ width: '100%' }} step={0.000001} />
                        </Form.Item>
                    </>
                )}

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

                {/* Убийца */}
                <Divider className="dragons-divider">Убийца (может быть пусто)</Divider>
                <div className="dragons-segment-row">
                    <span className="dragons-segment-label">Режим убийцы:</span>
                    <Segmented
                        value={modeKiller}
                        onChange={(val) => {
                            setModeKiller(val);
                            if (val !== "create") setModeKillerLocation("choose");
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
                                    p.location ? ` / loc: ${p.location.name} x=${p.location.x}, y=${p.location.y}, z=${p.location.z}${p.location.name ? `` : ""}` : ""
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
                                    rules={[{ required: true, message: "Укажи x" }]}
                                >
                                    <InputNumber className="dragons-input-number" step={0.01} />
                                </Form.Item>

                                <Form.Item
                                    name="locY"
                                    label="y (float, обяз.)"
                                    rules={[{ required: true, message: "Укажи y" }]}
                                >
                                    <InputNumber className="dragons-input-number" step={0.01} />
                                </Form.Item>

                                <Form.Item
                                    name="locZ"
                                    label="z (Integer, обяз.)"
                                    rules={[{ required: true, message: "Укажи z" }]}
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

                {/* Характеристики */}
                <Divider className="dragons-divider">Характеристики дракона</Divider>
                <Form.Item
                    name="age"
                    label="Возраст (> 0)"
                    rules={[
                        { required: true, message: "Укажи возраст" },
                        { validator: (_, v) => Number(v) > 0 ? Promise.resolve() : Promise.reject(new Error("Значение должно быть > 0")) },
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

                {/* Голова */}
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
                                { validator: (_, v) => Number(v) > 0 ? Promise.resolve() : Promise.reject(new Error("Должно быть > 0")) },
                            ]}
                        >
                            <InputNumber className="dragons-input-number" min={1} precision={0} />
                        </Form.Item>
                        <Form.Item
                            name="headEyesCount"
                            label="eyesCount (целое > 0)"
                            rules={[
                                { required: true, message: "Укажи eyesCount" },
                                { validator: (_, v) => Number(v) > 0 ? Promise.resolve() : Promise.reject(new Error("Должно быть > 0")) },
                            ]}
                        >
                            <InputNumber className="dragons-input-number" min={1} precision={0} />
                        </Form.Item>
                        <Form.Item
                            name="headToothCount"
                            label="toothCount (целое > 0)"
                            rules={[
                                { required: true, message: "Укажи toothCount" },
                                { validator: (_, v) => Number(v) > 0 ? Promise.resolve() : Promise.reject(new Error("Должно быть > 0")) },
                            ]}
                        >
                            <InputNumber className="dragons-input-number" min={1} precision={0} />
                        </Form.Item>
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default EditDragonModal;
