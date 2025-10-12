
import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Typography, Card, Tag, Alert } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { GetApi, CreateApi, DeleteApi } from '../../api';
import { apiConfig } from '../../apiConfig';

const { Title, Text } = Typography;

const getApi = new GetApi(apiConfig);
const createApi = new CreateApi(apiConfig);
const deleteApi = new DeleteApi(apiConfig);

const LocationsPage = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [saveLoading, setSaveLoading] = useState(false);


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



    const [filters, setFilters] = useState({
        id: '',
        x: '',
        y: '',
        z: '',
        name: ''
    });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            id: '',
            x: '',
            y: '',
            z: '',
            name: ''
        });
        notify('info', 'Фильтры сброшены');
    };


    const filteredData = data.filter((item) => {
        const idMatch = !filters.id || String(item.id).includes(filters.id.trim());
        const xMatch = !filters.x || String(item.x ?? '').includes(filters.x.trim());
        const yMatch = !filters.y || String(item.y ?? '').includes(filters.y.trim());
        const zMatch = !filters.z || String(item.z ?? '').includes(filters.z.trim());
        const nameMatch =
            !filters.name || String(item.name ?? '').toLowerCase().includes(filters.name.trim().toLowerCase());
        return idMatch && xMatch && yMatch && zMatch && nameMatch;
    });

    const columns = [
        {
            title: (
                <div>
                    ID
                    <Input
                        size="small"
                        placeholder="Фильтр"
                        style={{ marginTop: 6 }}
                        value={filters.id}
                        onChange={(e) => handleFilterChange('id', e.target.value)}
                    />
                </div>
            ),
            dataIndex: 'id',
            key: 'id',
            width: 100
        },
        {
            title: (
                <div>
                    Координата X
                    <Input
                        size="small"
                        placeholder="Фильтр"
                        style={{ marginTop: 6 }}
                        value={filters.x}
                        onChange={(e) => handleFilterChange('x', e.target.value)}
                    />
                </div>
            ),
            dataIndex: 'x',
            key: 'x',
            render: (x) => (x !== null && x !== undefined ? <Tag color="blue">{x}</Tag> : '—')
        },
        {
            title: (
                <div>
                    Координата Y
                    <Input
                        size="small"
                        placeholder="Фильтр"
                        style={{ marginTop: 6 }}
                        value={filters.y}
                        onChange={(e) => handleFilterChange('y', e.target.value)}
                    />
                </div>
            ),
            dataIndex: 'y',
            key: 'y',
            render: (y) => (y !== null && y !== undefined ? <Tag color="green">{y}</Tag> : '—')
        },
        {
            title: (
                <div>
                    Координата Z
                    <Input
                        size="small"
                        placeholder="Фильтр"
                        style={{ marginTop: 6 }}
                        value={filters.z}
                        onChange={(e) => handleFilterChange('z', e.target.value)}
                    />
                </div>
            ),
            dataIndex: 'z',
            key: 'z',
            render: (z) => (z !== null && z !== undefined ? <Tag color="orange">{z}</Tag> : '—')
        },
        {
            title: (
                <div>
                    Название
                    <Input
                        size="small"
                        placeholder="Фильтр"
                        style={{ marginTop: 6 }}
                        value={filters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                    />
                </div>
            ),
            dataIndex: 'name',
            key: 'name',
            render: (name) => name || <Text type="secondary">—</Text>
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Button size="small" danger onClick={() => handleDelete(record.id)}>
                    Удалить
                </Button>
            )
        }
    ];

    const loadData = async () => {
        setLoading(true);
        try {
            const { data: locations } = await getApi.getLocations({
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(locations ?? []);
        } catch (_error) {
            notify('error', 'Ошибка загрузки локаций');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (values.x == null || values.y == null || values.z == null) {
                notify('warning', 'Координаты X, Y, Z обязательны');
                return;
            }

            setSaveLoading(true);

            const payload = {
                x: values.x,
                y: values.y,
                z: values.z,
                name: values.name || null
            };

            await createApi.createLocation(payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            notify('success', 'Локация создана');
            setModalVisible(false);
            form.resetFields();
            loadData();
        } catch (error) {
            if (error?.errorFields) {
                notify('warning', 'Заполните все обязательные поля');
            } else {
                notify('error', 'Ошибка сохранения');
            }
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteApi.deleteLocationById(id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (_error) {
            notify('error', 'Ошибка удаления');
            return;
        }
        notify('success', 'Локация удалена');
        loadData();
    };

    useEffect(() => {
        loadData();
    }, [token]);

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Title level={3}>Управление локациями</Title>
                <Space>
                    <Button onClick={() => navigate('/refs')}>Назад к справочникам</Button>
                    <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                        Сбросить фильтры
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                        Добавить локацию
                    </Button>
                </Space>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 900 }}
                />
            </Card>

            <Modal
                title="Добавить локацию"
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText="Сохранить"
                cancelText="Отмена"
                confirmLoading={saveLoading}
                width={500}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="x" label="Координата X (обязательно)" rules={[{ required: true, message: 'Введите X' }]}>
                        <InputNumber style={{ width: '100%' }} step={0.01} placeholder="Координата X" />
                    </Form.Item>
                    <Form.Item name="y" label="Координата Y (обязательно)" rules={[{ required: true, message: 'Введите Y' }]}>
                        <InputNumber style={{ width: '100%' }} step={0.01} placeholder="Координата Y" />
                    </Form.Item>
                    <Form.Item name="z" label="Координата Z (обязательно)" rules={[{ required: true, message: 'Введите Z' }]}>
                        <InputNumber style={{ width: '100%' }} step={1} placeholder="Координата Z" />
                    </Form.Item>
                    <Form.Item name="name" label="Название локации (можно оставить пустым)">
                        <Input placeholder="Название локации" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Панель уведомлений внизу */}
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

export default LocationsPage;
