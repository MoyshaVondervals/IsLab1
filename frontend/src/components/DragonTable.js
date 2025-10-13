import { Button, Form, Input, message, Popconfirm, Space, Table, Tag, Typography } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CheckOutlined, CloseOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Client } from "@stomp/stompjs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { DragonApi } from "../api";
import { apiConfig } from "../apiConfig";



const getApi = new DragonApi(apiConfig);

const DRAGON_TYPES = ["WATER", "UNDERGROUND", "AIR", "FIRE"];
const COLOR_ENUM = ["RED", "BLACK", "YELLOW", "WHITE", "BROWN"];
const COUNTRY_ENUM = ["FRANCE", "SPAIN", "VATICAN", "ITALY", "NORTH_KOREA"];
const { Title, Text } = Typography;


const WS_URL =
    (window.location.protocol === "https:" ? "wss://" : "ws://") +
    "127.0.0.1:8083/ws";
const TOPIC = "/topic/echo";

function normalizeDragon(d) {
    return {
        id: d.id,
        name: d.name,
        creationDate: d.creationDate,
        age: d.age,
        description: d.description,
        wingspan: d.wingspan ?? null,
        type: d.type ?? null,
        coordinates: d.coordinates
            ? {
                id: d.coordinates.id ?? undefined,
                x: d.coordinates.x != null ? Number(d.coordinates.x) : null,
                y: d.coordinates.y != null ? Number(d.coordinates.y) : null,
            }
            : null,
        cave: d.cave ?? null,
        head: d.head ?? null,
        killer: d.killer ?? null,
    };
}


function parseWebSocketMessage(messageBody) {
    try {
        const data = JSON.parse(messageBody);


        if (Array.isArray(data)) {
            return data.map(normalizeDragon);
        }


        if (data.id !== undefined) {
            return [normalizeDragon(data)];
        }


        if (data.dragons && Array.isArray(data.dragons)) {
            return data.dragons.map(normalizeDragon);
        }

        console.warn("Неизвестный формат данных WebSocket:", data);
        return [];
    } catch (error) {
        console.error("Ошибка парсинга WebSocket сообщения:", error);
        return [];
    }
}

const DragonTable = () => {
    const navigate = useNavigate();

    const idSearchInputRef = useRef(null);
    const ageSearchInputRef = useRef(null);
    const wingspanSearchInputRef = useRef(null);
    const headSizeSearchInputRef = useRef(null);
    const headEyesSearchInputRef = useRef(null);
    const headTeethSearchInputRef = useRef(null);
    const killerNameSearchInputRef = useRef(null);
    const killerPassportSearchInputRef = useRef(null);
    const killerLocationXSearchInputRef = useRef(null);
    const killerLocationYSearchInputRef = useRef(null);
    const killerLocationZSearchInputRef = useRef(null);
    const killerLocationNameSearchInputRef = useRef(null);
    const [data, setData] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const nameSearchInputRef = useRef(null);
    const xSearchInputRef = useRef(null);
    const ySearchInputRef = useRef(null);
    const depthSearchInputRef = useRef(null);
    const treasuresSearchInputRef = useRef(null);
    const descriptionSearchInputRef = useRef(null);

    const token = useSelector((state) => state.auth.token);


    const [persons] = useState([]);
    const [locations] = useState([]);


    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);

    const clientRef = useRef(null);
    const subRef = useRef(null);


    const handleRowClick = (record) => {
        navigate(`/dragons/${record.id}`);
    };

    const getRowProps = (record) => {
        return {
            onClick: () => handleRowClick(record),
            style: {
                cursor: "pointer",
                transition: "all 0.2s",
            },
            onMouseEnter: (e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
                e.currentTarget.style.transform = "scale(1.01)";
            },
            onMouseLeave: (e) => {
                e.currentTarget.style.backgroundColor = "";
                e.currentTarget.style.transform = "scale(1)";
            },
        };
    };


    const updateTableFromWebSocket = (messageBody) => {
        try {
            const newDragons = parseWebSocketMessage(messageBody);
            if (newDragons.length > 0) {
                setData((prevData) => {
                    const merged = [...prevData];
                    newDragons.forEach((nd) => {
                        const idx = merged.findIndex((d) => d.id === nd.id);
                        if (idx >= 0) merged[idx] = nd;
                        else merged.unshift(nd);
                    });
                    return merged.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
                });

                message.success(`Обновлено ${newDragons.length} записей через WebSocket`);
            }
        } catch (error) {
            console.error("Ошибка обработки WebSocket сообщения:", error);
            message.error("Ошибка обработки данных из WebSocket");
        }
    };

    const connect = () => {
        if (connecting || connected) return;
        setConnecting(true);

        if (clientRef.current) {
            try {
                clientRef.current.deactivate();
            } catch (e) {}
            clientRef.current = null;
            subRef.current = null;
        }

        const client = new Client({
            brokerURL: WS_URL,
            reconnectDelay: 3000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
            onConnect: () => {
                setConnected(true);
                setConnecting(false);

                try {
                    if (subRef.current) {
                        try {
                            subRef.current.unsubscribe();
                        } catch (_) {}
                        subRef.current = null;
                    }

                    subRef.current = client.subscribe(TOPIC, (message) => {
                        updateTableFromWebSocket(message.body);
                    });
                } catch (e) {
                    message.error("Не удалось подписаться на канал WebSocket");
                }
            },
            onWebSocketClose: () => {
                setConnected(false);
                setConnecting(false);
            },
            onStompError: (frame) => {
                message.error(
                    `STOMP ERROR: ${((frame.headers && frame.headers["message"]) || "")} ${(frame.body || "")}`.trim()
                );
            },
            onWebSocketError: () => {
                message.error("Ошибка WebSocket соединения");
            },
            debug: () => {},
        });

        client.activate();
        clientRef.current = client;
    };

    const cleanupWS = () => {
        try {
            if (subRef.current) {
                try {
                    subRef.current.unsubscribe();
                } catch (_) {}
                subRef.current = null;
            }
            if (clientRef.current) {
                try {
                    clientRef.current.deactivate();
                } catch (_) {}
                clientRef.current = null;
            }
        } finally {
            setConnected(false);
            setConnecting(false);
        }
    };

    useEffect(() => {
        connect();
        return () => {
            cleanupWS();
        };
    }, [token]);

    const numberSearchDropdown = (ref, placeholder = "Точное значение") => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div className="dragons-filter-dropdown" onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={ref}
                    placeholder={placeholder}
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        const v = e.target.value;
                        setSelectedKeys(v !== "" ? [v] : []);
                    }}
                    onPressEnter={() => confirm()}
                    allowClear
                    className="dragons-filter-input"
                    inputMode="decimal"
                    suffix={<SearchOutlined className="dragons-filter-icon" />}
                />
                <div className="dragons-filter-actions">
                    <Button type="primary" icon={<CheckOutlined />} onClick={() => confirm()}>
                        Применить
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            clearFilters?.();
                            confirm({ closeDropdown: false });
                        }}
                    >
                        Сбросить
                    </Button>
                    <Button icon={<CloseOutlined />} onClick={() => close()}>
                        Закрыть
                    </Button>
                </div>
            </div>
        ),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) setTimeout(() => ref?.current?.select(), 100);
        },
        filterIcon: (filtered) => (
            <SearchOutlined className={filtered ? "dragons-filter-icon--active" : "dragons-filter-icon"} />
        ),
    });

    const textSearchDropdown = (ref) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div className="dragons-filter-dropdown" onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={ref}
                    placeholder="Поиск по подстроке"
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    allowClear
                    className="dragons-filter-input"
                    suffix={<SearchOutlined className="dragons-filter-icon" />}
                />
                <div className="dragons-filter-actions">
                    <Button type="primary" icon={<CheckOutlined />} onClick={() => confirm()}>
                        Применить
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            clearFilters?.();
                            confirm({ closeDropdown: false });
                        }}
                    >
                        Сбросить
                    </Button>
                    <Button icon={<CloseOutlined />} onClick={() => close()}>
                        Закрыть
                    </Button>
                </div>
            </div>
        ),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) setTimeout(() => ref?.current?.select(), 100);
        },
        filterIcon: (filtered) => (
            <SearchOutlined className={filtered ? "dragons-filter-icon--active" : "dragons-filter-icon"} />
        ),
    });

    const loadList = async () => {
        try {
            setLoadingTable(true);


            const { data: payload } = await getApi.getDragons({
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let rawData = [];
            if (Array.isArray(payload)) {
                rawData = payload;
            } else if (payload && Array.isArray(payload.dragons)) {
                rawData = payload.dragons;
            } else if (payload) {
                rawData = [payload];
            }

            const normalized = rawData.map(normalizeDragon).sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
            setData(normalized);
        } catch (e) {
            console.error("Ошибка загрузки данных:", e);
            const errMsg =
                e?.response?.data?.message ||
                (typeof e?.response?.data === "string" ? e.response.data : null) ||
                e?.message ||
                "Ошибка загрузки";
            message.error(`Ошибка загрузки: ${errMsg}`);
            setData([]);
        } finally {
            setLoadingTable(false);
        }
    };

    useEffect(() => {
        loadList();

    }, [token]);

    const columns = useMemo(
        () => [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
                width: 96,
                sorter: (a, b) => (a.id ?? 0) - (b.id ?? 0),
                defaultSortOrder: "descend",
                ...numberSearchDropdown(idSearchInputRef, "ID ="),
                onFilter: (value, record) => {
                    if (value === undefined || value === null || value === "") return true;
                    return String(record.id) === String(value);
                },
                render: (v) => <Text code>#{v}</Text>,
            },
            {
                title: "Имя",
                dataIndex: "name",
                key: "name",
                width: 180,
                ...textSearchDropdown(nameSearchInputRef),
                onFilter: (value, record) =>
                    String(record.name || "").toLowerCase().includes(String(value).toLowerCase()),
                render: (v) => <Text strong>{v}</Text>,
            },
            {
                title: "Возраст",
                dataIndex: "age",
                key: "age",
                width: 120,
                sorter: (a, b) => (a.age ?? 0) - (b.age ?? 0),
                ...numberSearchDropdown(ageSearchInputRef, "Возраст ="),
                onFilter: (value, record) => {
                    if (value === undefined || value === null || value === "") return true;
                    return String(record.age) === String(value);
                },
                render: (v) => (v ? `${v}` : "—"),
            },
            {
                title: "Размах крыльев",
                dataIndex: "wingspan",
                key: "wingspan",
                width: 160,
                sorter: (a, b) => (a.wingspan ?? 0) - (b.wingspan ?? 0),
                ...numberSearchDropdown(wingspanSearchInputRef, "Размах ="),
                onFilter: (value, record) => {
                    if (value === undefined || value === null || value === "") return true;
                    if (record.wingspan === undefined || record.wingspan === null) return false;
                    return String(record.wingspan) === String(value);
                },
                render: (v) => (v ? `${v}` : "—"),
            },
            {
                title: "Тип дракона",
                dataIndex: "type",
                key: "type",
                width: 140,
                filters: DRAGON_TYPES.map((t) => ({ text: t, value: t })),
                onFilter: (val, rec) => rec.type === val,
                render: (t) => (t ? <Tag color="blue">{t}</Tag> : <Tag>—</Tag>),
            },
            {
                title: "Координаты",
                key: "coordinatesGroup",
                children: [
                    {
                        title: "X",
                        key: "coordX",
                        width: 120,
                        ...numberSearchDropdown(xSearchInputRef, "X ="),
                        onFilter: (value, record) => {
                            const x = record.coordinates?.x;
                            if (value === undefined || value === null || value === "") return true;
                            if (x === undefined || x === null) return false;
                            return String(x) === String(value);
                        },
                        sorter: (a, b) => (a.coordinates?.x ?? 0) - (b.coordinates?.x ?? 0),
                        render: (_, rec) =>
                            rec.coordinates?.x !== undefined && rec.coordinates?.x !== null ? (
                                <Text code>{rec.coordinates.x}</Text>
                            ) : (
                                "—"
                            ),
                    },
                    {
                        title: "Y",
                        key: "coordY",
                        width: 120,
                        ...numberSearchDropdown(ySearchInputRef, "Y ="),
                        onFilter: (value, record) => {
                            const y = record.coordinates?.y;
                            if (value === undefined || value === null || value === "") return true;
                            if (y === undefined || y === null) return false;
                            return String(y) === String(value);
                        },
                        sorter: (a, b) => (a.coordinates?.y ?? 0) - (b.coordinates?.y ?? 0),
                        render: (_, rec) =>
                            rec.coordinates?.y !== undefined && rec.coordinates?.y !== null ? (
                                <Text code>{rec.coordinates.y}</Text>
                            ) : (
                                "—"
                            ),
                    },
                ],
            },
            {
                title: "Пещера",
                dataIndex: "cave",
                key: "cave",
                width: 140,
                ...numberSearchDropdown(treasuresSearchInputRef, "Сокровища ="),
                onFilter: (value, record) => {
                    const v = record.cave?.numberOfTreasures;
                    if (value === undefined || value === null || value === "") return true;
                    if (v === undefined || v === null) return false;
                    return String(v) === String(value);
                },
                sorter: (a, b) => (a.cave?.numberOfTreasures ?? 0) - (b.cave?.numberOfTreasures ?? 0),
                render: (cave) =>
                    cave?.numberOfTreasures !== undefined ? <Text code>{cave.numberOfTreasures}</Text> : "—",
            },
            {
                title: "Голова дракона",
                key: "headGroup",
                children: [
                    {
                        title: "Размер",
                        dataIndex: ["head", "size"],
                        key: "headSize",
                        width: 120,
                        sorter: (a, b) => (a.head?.size ?? 0) - (b.head?.size ?? 0),
                        ...numberSearchDropdown(headSizeSearchInputRef, "Размер ="),
                        onFilter: (value, record) => {
                            if (value === undefined || value === null || value === "") return true;
                            if (record.head?.size === undefined || record.head?.size === null) return false;
                            return String(record.head.size) === String(value);
                        },
                        render: (v) => (v ? <Text code>{v}</Text> : "—"),
                    },
                    {
                        title: "Глаза",
                        dataIndex: ["head", "eyesCount"],
                        key: "headEyes",
                        width: 120,
                        sorter: (a, b) => (a.head?.eyesCount ?? 0) - (b.head?.eyesCount ?? 0),
                        ...numberSearchDropdown(headEyesSearchInputRef, "Глаза ="),
                        onFilter: (value, record) => {
                            if (value === undefined || value === null || value === "") return true;
                            if (record.head?.eyesCount === undefined || record.head?.eyesCount === null) return false;
                            return String(record.head.eyesCount) === String(value);
                        },
                        render: (v) => (v ? <Text code>{v}</Text> : "—"),
                    },
                    {
                        title: "Зубы",
                        dataIndex: ["head", "toothCount"],
                        key: "headTeeth",
                        width: 120,
                        sorter: (a, b) => (a.head?.toothCount ?? 0) - (b.head?.toothCount ?? 0),
                        ...numberSearchDropdown(headTeethSearchInputRef, "Зубы ="),
                        onFilter: (value, record) => {
                            if (value === undefined || value === null || value === "") return true;
                            if (record.head?.toothCount === undefined || record.head?.toothCount === null) return false;
                            return String(record.head.toothCount) === String(value);
                        },
                        render: (v) => (v ? <Text code>{v}</Text> : "—"),
                    },
                ],
            },
            {
                title: "Убийца",
                key: "killerGroup",
                children: [
                    {
                        title: "Имя убийцы",
                        dataIndex: ["killer", "name"],
                        key: "killerName",
                        width: 160,
                        ...textSearchDropdown(killerNameSearchInputRef),
                        onFilter: (value, record) => {
                            if (value === undefined || value === null || value === "") return true;
                            const killerName = record.killer?.name;
                            if (!killerName) return false;
                            return killerName.toLowerCase().includes(value.toLowerCase());
                        },
                        render: (v) => (v ? <Text strong>{v}</Text> : "—"),
                    },
                    {
                        title: "Паспорт",
                        dataIndex: ["killer", "passportID"],
                        key: "killerPassport",
                        width: 140,
                        ...textSearchDropdown(killerPassportSearchInputRef),
                        onFilter: (value, record) => {
                            if (value === undefined || value === null || value === "") return true;
                            const passport = record.killer?.passportID;
                            if (!passport) return false;
                            return passport.toLowerCase().includes(value.toLowerCase());
                        },
                        render: (v) => (v ? <Text code>{v}</Text> : "—"),
                    },
                    {
                        title: "Национальность",
                        dataIndex: ["killer", "nationality"],
                        key: "killerNationality",
                        width: 140,
                        filters: COUNTRY_ENUM.map((c) => ({ text: c, value: c })),
                        onFilter: (val, rec) => rec.killer?.nationality === val,
                        render: (v) => (v ? <Tag color="green">{v}</Tag> : "—"),
                    },
                    {
                        title: "Цвет глаз",
                        dataIndex: ["killer", "eyeColor"],
                        key: "killerEyeColor",
                        width: 140,
                        filters: COLOR_ENUM.map((c) => ({ text: c, value: c })),
                        onFilter: (val, rec) => rec.killer?.eyeColor === val,
                        render: (v) => (v ? <Tag color={v.toLowerCase()}>{v}</Tag> : "—"),
                    },
                    {
                        title: "Цвет волос",
                        dataIndex: ["killer", "hairColor"],
                        key: "killerHairColor",
                        width: 140,
                        filters: [...COLOR_ENUM.map((c) => ({ text: c, value: c })), { text: "Не указан", value: "NULL" }],
                        onFilter: (val, rec) => {
                            if (val === "NULL") return rec.killer?.hairColor === null || rec.killer?.hairColor === undefined;
                            return rec.killer?.hairColor === val;
                        },
                        render: (v) => (v ? <Tag color={v.toLowerCase()}>{v}</Tag> : <Tag color="default">—</Tag>),
                    },
                ],
            },
            {
                title: "Локация убийцы",
                key: "killerLocationGroup",
                children: [
                    {
                        title: "X",
                        dataIndex: ["killer", "location", "x"],
                        key: "killerLocationX",
                        width: 100,
                        ...numberSearchDropdown(killerLocationXSearchInputRef, "X ="),
                        onFilter: (value, record) => {
                            if (value === undefined || value === null || value === "") return true;
                            const x = record.killer?.location?.x;
                            if (x === undefined || x === null) return false;
                            return String(x) === String(value);
                        },
                        render: (v) => (v !== undefined && v !== null ? <Text code>{v}</Text> : "—"),
                    },
                    {
                        title: "Y",
                        dataIndex: ["killer", "location", "y"],
                        key: "killerLocationY",
                        width: 100,
                        ...numberSearchDropdown(killerLocationYSearchInputRef, "Y ="),
                        onFilter: (value, record) => {
                            if (value === undefined || value === null || value === "") return true;
                            const y = record.killer?.location?.y;
                            if (y === undefined || y === null) return false;
                            return String(y) === String(value);
                        },
                        render: (v) => (v !== undefined && v !== null ? <Text code>{v}</Text> : "—"),
                    },
                    {
                        title: "Z",
                        dataIndex: ["killer", "location", "z"],
                        key: "killerLocationZ",
                        width: 100,
                        ...numberSearchDropdown(killerLocationZSearchInputRef, "Z ="),
                        onFilter: (value, record) => {
                            if (value === undefined || value === null || value === "") return true;
                            const z = record.killer?.location?.z;
                            if (z === undefined || z === null) return false;
                            return String(z) === String(value);
                        },
                        render: (v) => (v !== undefined && v !== null ? <Text code>{v}</Text> : "—"),
                    },
                    {
                        title: "Название",
                        dataIndex: ["killer", "location", "name"],
                        key: "killerLocationName",
                        width: 150,
                        ...textSearchDropdown(killerLocationNameSearchInputRef),
                        onFilter: (value, record) => {
                            if (value === undefined || value === null || value === "") return true;
                            const name = record.killer?.location?.name;
                            if (!name) return false;
                            return name.toLowerCase().includes(value.toLowerCase());
                        },
                        render: (v) => (v ? <Text>{v}</Text> : "—"),
                    },
                ],
            },
            {
                title: "Дата создания",
                dataIndex: "creationDate",
                key: "creationDate",
                width: 180,
                sorter: (a, b) => new Date(a.creationDate ?? 0).getTime() - new Date(b.creationDate ?? 0).getTime(),
                filters: [
                    { text: "Сегодня", value: "today" },
                    { text: "За последнюю неделю", value: "week" },
                    { text: "За последний месяц", value: "month" },
                ],
                onFilter: (value, record) => {
                    if (!record.creationDate) return false;
                    const recordDate = new Date(record.creationDate);
                    const now = new Date();

                    switch (value) {
                        case "today":
                            return recordDate.toDateString() === now.toDateString();
                        case "week": {
                            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                            return recordDate >= weekAgo;
                        }
                        case "month": {
                            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                            return recordDate >= monthAgo;
                        }
                        default:
                            return true;
                    }
                },
                render: (v) => (v ? new Date(v).toLocaleString() : "—"),
            },
            {
                title: "Описание",
                dataIndex: "description",
                key: "description",
                ellipsis: true,
                ...textSearchDropdown(descriptionSearchInputRef),
                onFilter: (value, record) => {
                    if (value === undefined || value === null || value === "") return true;
                    const description = record.description || "";
                    return description.toLowerCase().includes(value.toLowerCase());
                },
                render: (v) => (v ? <Text>{v}</Text> : "—"),
            },
        ],
        []
    );

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Tag color={connected ? "green" : connecting ? "gold" : "red"}>
                    {connected ? "CONNECTED" : connecting ? "CONNECTING..." : "DISCONNECTED"}
                </Tag>

                <Button icon={<ReloadOutlined />} onClick={loadList}>
                    Обновить данные
                </Button>
            </Space>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                loading={loadingTable}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                scroll={{ x: 1400 }}
                size="middle"
                onRow={getRowProps}
            />
        </div>
    );
};

export default DragonTable;
