import React, { useEffect, useState, useRef } from 'react';
import {
    Card,
    Typography,
    Button,
    Space,
    Select,
    InputNumber,
    Table,
    Alert
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useApiClient from '../../utils/requestController';

const { Title } = Typography;
const { Option } = Select;

const DragonOperationsPage = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const api = useApiClient();

    const [selectedOp, setSelectedOp] = useState(null);
    const [param, setParam] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [persons, setPersons] = useState([]);
    const [killerId, setKillerId] = useState(null);

    // ---------- Уведомления (панель снизу) ----------
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
    // ---------- конец уведомлений ----------

    // helper: гарантируем массив для antd Table
    const toArray = (data) => {
        if (Array.isArray(data)) return data;
        if (data === null || data === undefined) return [];
        return [data];
    };

    const loadPersons = async () => {
        try {
            const resp = await api.get('/getPerson', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPersons(resp.data || []);
            notify('success', 'Список убийц загружен');
        } catch (e) {
            notify('error', 'Ошибка загрузки убийц');
        }
    };

    useEffect(() => {
        loadPersons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRun = async () => {
        if (!selectedOp) {
            notify('warning', 'Выберите операцию');
            return;
        }

        setLoading(true);
        setResult(null);
        try {
            let response;
            switch (selectedOp) {
                case 'avgAge': {
                    response = await api.get('/dragons/avgAge', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setResult({ avgAge: response.data });
                    notify('success', 'Расчёт среднего возраста выполнен');
                    break;
                }

                case 'maxCave': {
                    response = await api.get('/dragons/maxCave', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setResult(response.data);
                    notify('success', 'Получен дракон с максимальным числом сокровищ');
                    break;
                }

                case 'headGreater': {
                    if (!param) {
                        notify('error', 'Укажите N для размера головы');
                        return;
                    }
                    response = await api.get(`/dragons/headGreater/${param}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setResult(toArray(response.data));
                    notify('success', `Найдены драконы с размером головы > ${param}`);
                    break;
                }

                case 'oldestDragon': {
                    response = await api.get('/dragons/oldest', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setResult(Array.isArray(response.data) ? response.data[0] : response.data);
                    notify('success', 'Получен самый старый дракон');
                    break;
                }

                case 'killDragon': {
                    if (!param) {
                        notify('error', 'Введите ID дракона');
                        return;
                    }
                    if (!killerId) {
                        notify('error', 'Выберите убийцу');
                        return;
                    }
                    // В axios 2-й аргумент — тело запроса. Передаём null и выносим headers в 3-й аргумент.
                    await api.post(
                        `/dragons/kill/${param}?killerId=${killerId}`,
                        null,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setResult({ killedId: param, killerId });
                    notify('success', `Дракон #${param} убит (убийца Person #${killerId})`);
                    break;
                }

                default: {
                    notify('error', 'Неизвестная операция');
                }
            }
        } catch (e) {
            const msg = e?.response?.data;
            notify('error', typeof msg === 'string' ? msg : 'Ошибка операции');
        } finally {
            setLoading(false);
        }
    };

    // колонки для отображения дракона
    const dragonColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Имя', dataIndex: 'name', key: 'name' },
        { title: 'Возраст', dataIndex: 'age', key: 'age' },
        { title: 'Описание', dataIndex: 'description', key: 'description' },
        { title: 'Тип', dataIndex: 'type', key: 'type' },
        { title: 'Размах крыльев', dataIndex: 'wingspan', key: 'wingspan' },
        {
            title: 'Координаты',
            key: 'coordinates',
            render: (_, record) =>
                record.coordinates ? `x: ${record.coordinates.x}, y: ${record.coordinates.y}` : '—'
        },
        {
            title: 'Пещера',
            key: 'cave',
            render: (_, record) =>
                record.cave?.numberOfTreasures
                    ? `${record.cave.numberOfTreasures} сокровищ`
                    : '—'
        },
        {
            title: 'Голова',
            key: 'head',
            render: (_, record) =>
                record.head
                    ? `Размер: ${record.head.size}, глаза: ${record.head.eyesCount}, зубы: ${record.head.toothCount}`
                    : '—'
        },
        {
            title: 'Убийца',
            key: 'killer',
            render: (_, record) =>
                record.killer
                    ? `${record.killer.name} (${record.killer.nationality}, ${record.killer.eyeColor} глаза)`
                    : '—'
        },
        {
            title: 'Локация убийцы',
            key: 'killerLocation',
            render: (_, record) =>
                record.killer?.location
                    ? `${record.killer.location.name || 'Без имени'} (${record.killer.location.x}, ${record.killer.location.y}, ${record.killer.location.z})`
                    : '—'
        }
    ];

    const renderResult = () => {
        if (!result) return null;

        if (selectedOp === 'avgAge') {
            return (
                <Card style={{ marginTop: 16 }}>
                    Средний возраст драконов: <b>{result.avgAge}</b>
                </Card>
            );
        }

        if (selectedOp === 'maxCave' || selectedOp === 'oldestDragon') {
            return (
                <Table
                    style={{ marginTop: 16 }}
                    rowKey="id"
                    dataSource={toArray(result)}
                    columns={dragonColumns}
                    pagination={false}
                />
            );
        }

        if (selectedOp === 'headGreater') {
            return (
                <Table
                    style={{ marginTop: 16 }}
                    rowKey="id"
                    dataSource={result}
                    columns={dragonColumns}
                    pagination={{ pageSize: 5 }}
                />
            );
        }

        if (selectedOp === 'killDragon') {
            return (
                <Card style={{ marginTop: 16 }}>
                    Дракон #{result.killedId} убит убийцей Person #{result.killerId}
                </Card>
            );
        }

        return null;
    };

    return (
        <div style={{ padding: '20px' }}>
            <Space style={{ marginBottom: 20 }}>
                <Button onClick={() => navigate('/refs')}>Назад</Button>
            </Space>

            <Title level={3}>Операции над драконами</Title>

            <Card style={{ marginBottom: 20 }}>
                <Space wrap>
                    <Select
                        style={{ width: 500 }}
                        placeholder="Выберите операцию"
                        value={selectedOp}
                        onChange={(val) => {
                            setSelectedOp(val);
                            setResult(null);
                            setParam(null);
                        }}
                    >
                        <Option value="avgAge">Средний возраст</Option>
                        <Option value="maxCave">Дракон с максимальным количеством сокровищ</Option>
                        <Option value="headGreater">Драконы с размером головы больше N</Option>
                        <Option value="oldestDragon">Самый старый дракон</Option>
                        <Option value="killDragon">Убить дракона по ID</Option>
                    </Select>

                    {selectedOp === 'headGreater' && (
                        <InputNumber
                            placeholder="Введите N"
                            value={param}
                            min={1}
                            onChange={setParam}
                        />
                    )}

                    {selectedOp === 'killDragon' && (
                        <>
                            <InputNumber
                                placeholder="ID дракона"
                                value={param}
                                min={1}
                                onChange={setParam}
                            />
                            <Select
                                style={{ width: 280 }}
                                placeholder="Выберите убийцу"
                                value={killerId}
                                onChange={setKillerId}
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {persons.map((p) => (
                                    <Option
                                        key={p.id}
                                        value={p.id}
                                        label={`${p.name || 'Без имени'} | ${p.nationality} | ${p.passportID}`}
                                    >
                                        {p.name || 'Без имени'} — {p.eyeColor}/{p.hairColor || 'NO-HAIR'} | {p.nationality} | {p.passportID}
                                    </Option>
                                ))}
                            </Select>
                        </>
                    )}

                    <Button type="primary" loading={loading} onClick={handleRun}>
                        Выполнить
                    </Button>
                </Space>
            </Card>

            {renderResult()}

            {/* Панель уведомлений внизу страницы */}
            <div style={{ marginTop: 16 }}>
                {notices.length > 0 && (
                    <Card size="small" title={`Уведомления (${notices.length})`}>
                        <Space direction="vertical" style={{ width: '100%' }}>
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
        </div>
    );
};

export default DragonOperationsPage;
