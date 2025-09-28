import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Table, Tag, Typography, Spin, Space, Row, Col, Alert } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useApiClient from '../../utils/requestController';
import { useSelector } from 'react-redux';
import EditDragonModal from "../EditDragonModal";

const { Title, Text } = Typography;

const DragonDetail = () => {
    const [editModalVisible, setEditModalVisible] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const api = useApiClient();
    const token = useSelector((state) => state.auth.token);

    const [loading, setLoading] = useState(true);
    const [dragon, setDragon] = useState(null);

    // --- Уведомления пользователя (панель снизу) ---
    const [notices, setNotices] = useState([]);
    const timersRef = useRef({});

    const removeNotice = (nid) => {
        setNotices((prev) => prev.filter((n) => n.id !== nid));
        if (timersRef.current[nid]) {
            clearTimeout(timersRef.current[nid]);
            delete timersRef.current[nid];
        }
    };

    const notify = (type, content, durationMs = 5000) => {
        const nid = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
        setNotices((prev) => [...prev, { id: nid, type, content }]);
        if (durationMs > 0) {
            const t = setTimeout(() => removeNotice(nid), durationMs);
            timersRef.current[nid] = t;
        }
    };

    useEffect(() => {
        return () => {
            Object.values(timersRef.current).forEach(clearTimeout);
            timersRef.current = {};
        };
    }, []);
    // --- конец уведомлений ---

    const loadDragon = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/getDragonById/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setDragon(response.data);
            notify('success', 'Информация о драконе загружена');
        } catch (_error) {
            notify('error', 'Не удалось загрузить информацию о драконе');
            navigate('/dragons');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/deleteDragonById/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            notify('success', 'Дракон успешно удалён');
            navigate('/dragons');
        } catch (_error) {
            notify('error', 'Не удалось удалить дракона');
        }
    };

    const handleEdit = () => {
        setEditModalVisible(true);
    };

    useEffect(() => {
        if (id) {
            loadDragon();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Данные для основной таблицы
    const mainData = [
        { key: '1', attribute: 'ID', value: dragon?.id || '—' },
        { key: '2', attribute: 'Имя', value: dragon?.name || '—' },
        { key: '3', attribute: 'Возраст', value: dragon?.age || '—' },
        { key: '4', attribute: 'Размах крыльев', value: dragon?.wingspan || '—' },
        { key: '5', attribute: 'Тип дракона', value: dragon?.type ? <Tag color="blue">{dragon.type}</Tag> : '—' },
        { key: '6', attribute: 'Дата создания', value: dragon?.creationDate ? new Date(dragon.creationDate).toLocaleString() : '—' },
        { key: '7', attribute: 'Описание', value: dragon?.description || '—' },
    ];

    const coordinatesData = dragon?.coordinates ? [
        { key: '1', attribute: 'X', value: dragon.coordinates.x },
        { key: '2', attribute: 'Y', value: dragon.coordinates.y },
    ] : [];

    const caveData = dragon?.cave ? [
        { key: '1', attribute: 'Количество сокровищ', value: dragon.cave.numberOfTreasures },
    ] : [];

    const headData = dragon?.head ? [
        { key: '1', attribute: 'Размер головы', value: dragon.head.size },
        { key: '2', attribute: 'Количество глаз', value: dragon.head.eyesCount },
        { key: '3', attribute: 'Количество зубов', value: dragon.head.toothCount },
    ] : [];

    const killerData = dragon?.killer ? [
        { key: '1', attribute: 'Имя', value: dragon.killer.name },
        { key: '2', attribute: 'Паспорт ID', value: dragon.killer.passportID },
        { key: '3', attribute: 'Национальность', value: dragon.killer.nationality ? <Tag color="green">{dragon.killer.nationality}</Tag> : '—' },
        { key: '4', attribute: 'Цвет глаз', value: dragon.killer.eyeColor ? <Tag color={dragon.killer.eyeColor.toLowerCase()}>{dragon.killer.eyeColor}</Tag> : '—' },
        { key: '5', attribute: 'Цвет волос', value: dragon.killer.hairColor ? <Tag color={dragon.killer.hairColor.toLowerCase()}>{dragon.killer.hairColor}</Tag> : '—' },
    ] : [];

    const killerLocationData = dragon?.killer?.location ? [
        { key: '1', attribute: 'X', value: dragon.killer.location.x },
        { key: '2', attribute: 'Y', value: dragon.killer.location.y },
        { key: '3', attribute: 'Z', value: dragon.killer.location.z },
        { key: '4', attribute: 'Название', value: dragon.killer.location.name },
    ] : [];

    const tableColumns = [
        {
            title: 'Атрибут',
            dataIndex: 'attribute',
            key: 'attribute',
            width: '40%',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Значение',
            dataIndex: 'value',
            key: 'value',
            width: '60%',
        },
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!dragon) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Title level={3}>Дракон не найден</Title>
                <Button type="primary" onClick={() => navigate('/dragons')}>
                    Вернуться к списку
                </Button>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>


            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/dragons')}
                    >
                        Назад к списку
                    </Button>

                    <Space>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleEdit}
                            style={{ marginRight: 8 }}
                        >
                            Редактировать
                        </Button>

                        <EditDragonModal
                            dragon={dragon}
                            visible={editModalVisible}
                            onCancel={() => setEditModalVisible(false)}
                            onSuccess={() => {
                                setEditModalVisible(false);
                                loadDragon();
                                notify('success', 'Дракон обновлён');
                            }}
                        />

                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleDelete}
                        >
                            Удалить
                        </Button>
                    </Space>
                </div>

                <Card>
                    <Title level={2} style={{ marginBottom: 24 }}>
                        {dragon.name} <Text type="secondary">#{dragon.id}</Text>
                    </Title>

                    <Row gutter={[16, 16]}>
                        {/* Основная информация */}
                        <Col xs={24} lg={12}>
                            <Card size="small" title="Основная информация" style={{ height: '100%' }}>
                                <Table
                                    dataSource={mainData}
                                    columns={tableColumns}
                                    pagination={false}
                                    showHeader={false}
                                    size="small"
                                />
                            </Card>
                        </Col>

                        {/* Координаты */}
                        <Col xs={24} lg={12}>
                            <Card size="small" title="Координаты" style={{ height: '100%' }}>
                                {coordinatesData.length > 0 ? (
                                    <Table
                                        dataSource={coordinatesData}
                                        columns={tableColumns}
                                        pagination={false}
                                        showHeader={false}
                                        size="small"
                                    />
                                ) : (
                                    <Text type="secondary">Нет данных</Text>
                                )}
                            </Card>
                        </Col>

                        {/* Пещера */}
                        <Col xs={24} lg={12}>
                            <Card size="small" title="Пещера" style={{ height: '100%' }}>
                                {caveData.length > 0 ? (
                                    <Table
                                        dataSource={caveData}
                                        columns={tableColumns}
                                        pagination={false}
                                        showHeader={false}
                                        size="small"
                                    />
                                ) : (
                                    <Text type="secondary">Нет данных</Text>
                                )}
                            </Card>
                        </Col>

                        {/* Голова */}
                        <Col xs={24} lg={12}>
                            <Card size="small" title="Голова" style={{ height: '100%' }}>
                                {headData.length > 0 ? (
                                    <Table
                                        dataSource={headData}
                                        columns={tableColumns}
                                        pagination={false}
                                        showHeader={false}
                                        size="small"
                                    />
                                ) : (
                                    <Text type="secondary">Нет данных</Text>
                                )}
                            </Card>
                        </Col>

                        {/* Убийца */}
                        <Col xs={24} lg={12}>
                            <Card size="small" title="Убийца" style={{ height: '100%' }}>
                                {killerData.length > 0 ? (
                                    <Table
                                        dataSource={killerData}
                                        columns={tableColumns}
                                        pagination={false}
                                        showHeader={false}
                                        size="small"
                                    />
                                ) : (
                                    <Text type="secondary">Нет данных</Text>
                                )}
                            </Card>
                        </Col>

                        {/* Локация убийцы */}
                        <Col xs={24} lg={12}>
                            <Card size="small" title="Локация убийцы" style={{ height: '100%' }}>
                                {killerLocationData.length > 0 ? (
                                    <Table
                                        dataSource={killerLocationData}
                                        columns={tableColumns}
                                        pagination={false}
                                        showHeader={false}
                                        size="small"
                                    />
                                ) : (
                                    <Text type="secondary">Нет данных</Text>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Space>

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

export default DragonDetail;
