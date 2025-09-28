import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Modal, Form, InputNumber, Input, Typography, Card, Alert } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useApiClient from '../../utils/requestController';
import { useSelector } from 'react-redux';

const { Title } = Typography;

const HeadsPage = () => {
    const navigate = useNavigate();
    const api = useApiClient();
    const token = useSelector((state) => state.auth.token);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [saveLoading, setSaveLoading] = useState(false);

    // --- Уведомления пользователя (как в CavesPage) ---
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
    // --- конец уведомлений ---

    // Состояние фильтров
    const [filters, setFilters] = useState({
        id: '',
        size: '',
        eyesCount: '',
        toothCount: ''
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            id: '',
            size: '',
            eyesCount: '',
            toothCount: ''
        });
    };

    // Отфильтрованные данные (клиентская фильтрация)
    const filteredData = data.filter(item => {
        const idMatch = !filters.id || String(item.id).includes(filters.id.trim());
        const sizeMatch = !filters.size || String(item.size ?? '').includes(filters.size.trim());
        const eyesMatch = !filters.eyesCount || String(item.eyesCount ?? '').includes(filters.eyesCount.trim());
        const toothMatch = !filters.toothCount || String(item.toothCount ?? '').includes(filters.toothCount.trim());
        return idMatch && sizeMatch && eyesMatch && toothMatch;
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
            width: 100,
        },
        {
            title: (
                <div>
                    Размер
                    <Input
                        size="small"
                        placeholder="Фильтр"
                        style={{ marginTop: 6 }}
                        value={filters.size}
                        onChange={(e) => handleFilterChange('size', e.target.value)}
                    />
                </div>
            ),
            dataIndex: 'size',
            key: 'size',
            render: (size) => size != null ? Number(size).toLocaleString() : '—'
        },
        {
            title: (
                <div>
                    Глаза
                    <Input
                        size="small"
                        placeholder="Фильтр"
                        style={{ marginTop: 6 }}
                        value={filters.eyesCount}
                        onChange={(e) => handleFilterChange('eyesCount', e.target.value)}
                    />
                </div>
            ),
            dataIndex: 'eyesCount',
            key: 'eyesCount',
            render: (v) => v != null ? v : '—'
        },
        {
            title: (
                <div>
                    Зубы
                    <Input
                        size="small"
                        placeholder="Фильтр"
                        style={{ marginTop: 6 }}
                        value={filters.toothCount}
                        onChange={(e) => handleFilterChange('toothCount', e.target.value)}
                    />
                </div>
            ),
            dataIndex: 'toothCount',
            key: 'toothCount',
            render: (v) => v != null ? v : '—'
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 160,
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        danger
                        onClick={() => handleDelete(record.id)}
                    >
                        Удалить
                    </Button>
                </Space>
            ),
        },
    ];

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/getHead', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setData(response.data || []);
        } catch (error) {
            console.error('Ошибка загрузки голов драконов:', error);
            notify('error', 'Ошибка загрузки голов драконов');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            // Валидация: все поля должны быть > 0
            if (Number(values.size) <= 0 || Number(values.eyesCount) <= 0 || Number(values.toothCount) <= 0) {
                notify('warning', 'Все значения должны быть больше 0');
                return;
            }

            setSaveLoading(true);

            const payload = {
                size: Number(values.size),
                eyesCount: Number(values.eyesCount),
                toothCount: Number(values.toothCount)
            };

            // Всегда POST — создание новой записи
            await api.post('/createHead', payload, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            notify('success', 'Голова создана');
            setModalVisible(false);
            form.resetFields();
            loadData();
        } catch (error) {
            if (error?.errorFields) {
                notify('warning', 'Пожалуйста, заполните поля корректно');
            } else {
                console.error('Ошибка сохранения головы:', error);
                notify('error', 'Ошибка сохранения');
            }
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/deleteHeadById/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            notify('success', 'Голова удалена');
            loadData();
        } catch (error) {
            console.error('Ошибка удаления головы:', error);
            notify('error', 'Ошибка удаления');
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Title level={3}>Управление головами драконов</Title>
                <Space>
                    <Button onClick={() => navigate('/refs')}>
                        Назад к справочникам
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                        Сбросить фильтры
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModalVisible(true)}
                    >
                        Добавить голову
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
                title="Добавить голову дракона"
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
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Form.Item
                        name="size"
                        label="Размер головы"
                        rules={[
                            { required: true, message: 'Введите размер' },
                            { type: 'number', min: 1, message: 'Размер должен быть больше 0' }
                        ]}
                    >
                        <InputNumber style={{ width: '100%' }} min={1} placeholder="Размер в мм" />
                    </Form.Item>

                    <Form.Item
                        name="eyesCount"
                        label="Количество глаз"
                        rules={[
                            { required: true, message: 'Введите количество глаз' },
                            { type: 'number', min: 1, message: 'Количество глаз должно быть больше 0' }
                        ]}
                    >
                        <InputNumber style={{ width: '100%' }} min={1} placeholder="Целое число" />
                    </Form.Item>

                    <Form.Item
                        name="toothCount"
                        label="Количество зубов"
                        rules={[
                            { required: true, message: 'Введите количество зубов' },
                            { type: 'number', min: 1, message: 'Количество зубов должно быть больше 0' }
                        ]}
                    >
                        <InputNumber style={{ width: '100%' }} min={1} placeholder="Целое число" />
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

export default HeadsPage;
