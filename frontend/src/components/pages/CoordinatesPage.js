
import React, { useState, useEffect, useRef } from 'react';
import {
    Table,
    Button,
    Space,
    Modal,
    Form,
    InputNumber,
    Input,
    Typography,
    Card,
    Alert
} from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { GetApi, CreateApi, DeleteApi } from '../../api';
import { apiConfig } from '../../apiConfig';

const { Title } = Typography;

const getApi = new GetApi(apiConfig);
const createApi = new CreateApi(apiConfig);
const deleteApi = new DeleteApi(apiConfig);

const CoordinatesPage = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [saveLoading, setSaveLoading] = useState(false);
    const [searchFilters, setSearchFilters] = useState({ id: '', x: '', y: '' });


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


    const handleSearchChange = (key, value) => {
        setSearchFilters((prev) => ({ ...prev, [key]: value }));
    };

    const filteredData = data.filter((item) => {
        return (
            (searchFilters.id === '' || String(item.id).includes(searchFilters.id)) &&
            (searchFilters.x === '' || String(item.x).includes(searchFilters.x)) &&
            (searchFilters.y === '' || String(item.y).includes(searchFilters.y))
        );
    });

    const columns = [
        {
            title: (
                <div>
                    ID
                    <Input
                        size="small"
                        placeholder="Фильтр"
                        style={{ marginTop: 4 }}
                        value={searchFilters.id}
                        onChange={(e) => handleSearchChange('id', e.target.value)}
                        prefix={<SearchOutlined />}
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
                    X
                    <Input
                        size="small"
                        placeholder="Фильтр"
                        style={{ marginTop: 4 }}
                        value={searchFilters.x}
                        onChange={(e) => handleSearchChange('x', e.target.value)}
                        prefix={<SearchOutlined />}
                    />
                </div>
            ),
            dataIndex: 'x',
            key: 'x',
            render: (value) => (typeof value === 'number' ? value.toFixed(6) : '—')
        },
        {
            title: (
                <div>
                    Y
                    <Input
                        size="small"
                        placeholder="Фильтр"
                        style={{ marginTop: 4 }}
                        value={searchFilters.y}
                        onChange={(e) => handleSearchChange('y', e.target.value)}
                        prefix={<SearchOutlined />}
                    />
                </div>
            ),
            dataIndex: 'y',
            key: 'y',
            render: (value) => (typeof value === 'number' ? value.toFixed(6) : '—')
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 160,
            render: (_, record) => (
                <Space>
                    <Button size="small" danger onClick={() => handleDelete(record.id)}>
                        Удалить
                    </Button>
                </Space>
            )
        }
    ];

    const loadCoordinates = async () => {
        setLoading(true);
        try {
            const { data: coords } = await getApi.getCoordinates({
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(coords || []);
        } catch (_error) {
            notify('error', 'Ошибка загрузки координат');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            setSaveLoading(true);

            const payload = {
                x: values.x,
                y: values.y
            };

            await createApi.createCoordinates(payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            notify('success', 'Координаты созданы');
            setModalVisible(false);
            form.resetFields();
            loadCoordinates();
        } catch (error) {
            if (error && error.errorFields) {
                notify('warning', 'Пожалуйста, заполните все обязательные поля');
            } else {
                notify('error', 'Ошибка сохранения');
            }
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteApi.deleteCoordinatesById(id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            notify('success', 'Координаты удалены');
            loadCoordinates();
        } catch (_error) {
            notify('error', 'Ошибка удаления');
        }
    };

    const resetFilters = () => {
        setSearchFilters({ id: '', x: '', y: '' });
        notify('info', 'Фильтры сброшены');
    };

    useEffect(() => {
        loadCoordinates();
    }, [token]);

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Title level={3}>Управление координатами</Title>
                <Space>
                    <Button onClick={() => navigate('/refs')}>Назад к справочникам</Button>
                    <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                        Сбросить фильтры
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                        Добавить
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
                />
            </Card>

            <Modal
                title="Добавить координаты"
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText="Сохранить"
                cancelText="Отмена"
                confirmLoading={saveLoading}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="x" label="Координата X" rules={[{ required: true, message: 'Введите X' }]}>
                        <InputNumber style={{ width: '100%' }} step={0.000001} />
                    </Form.Item>
                    <Form.Item name="y" label="Координата Y" rules={[{ required: true, message: 'Введите Y' }]}>
                        <InputNumber style={{ width: '100%' }} step={0.000001} />
                    </Form.Item>
                </Form>
            </Modal>

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

export default CoordinatesPage;
