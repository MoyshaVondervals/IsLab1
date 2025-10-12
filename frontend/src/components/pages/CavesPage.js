import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Modal, Form, InputNumber, Typography, Card, Tag, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


import { GetApi, CreateApi, DeleteApi } from '../../api';
import { apiConfig } from '../../apiConfig';

const { Title, Text } = Typography;

const getApi = new GetApi(apiConfig);
const createApi = new CreateApi(apiConfig);
const deleteApi = new DeleteApi(apiConfig);

const CavesPage = () => {
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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Количество сокровищ',
            dataIndex: 'numberOfTreasures',
            key: 'numberOfTreasures',
            render: (value) =>
                value !== null && value !== undefined ? (
                    <Tag color="gold">{Number(value).toFixed(1)}</Tag>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button size="small" danger onClick={() => handleDelete(record.id)}>
                        Удалить
                    </Button>
                </Space>
            ),
        },
    ];

    const loadData = async () => {
        setLoading(true);
        try {
            const { data: caves } = await getApi.getCaves({
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(caves || []);
        } catch (error) {
            notify('error', 'Ошибка загрузки пещер');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (
                values.numberOfTreasures !== null &&
                values.numberOfTreasures !== undefined &&
                values.numberOfTreasures <= 0
            ) {
                notify('warning', 'Количество сокровищ должно быть больше 0');
                return;
            }

            setSaveLoading(true);

            const payload = {
                numberOfTreasures:
                    values.numberOfTreasures === '' || values.numberOfTreasures === undefined
                        ? null
                        : values.numberOfTreasures,
            };

            await createApi.createCave(payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            notify('success', 'Пещера создана');
            setModalVisible(false);
            form.resetFields();
            loadData();
        } catch (error) {
            if (error?.errorFields) {
                notify('warning', 'Пожалуйста, заполните поля корректно');
            } else {
                notify('error', 'Ошибка сохранения');
            }
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteApi.deleteCaveById(id, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            notify('success', 'Пещера удалена');
            loadData();
        } catch (error) {
            notify('error', 'Ошибка удаления');
        }
    };

    useEffect(() => {
        loadData();
    }, [token]);

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Title level={3}>Управление пещерами</Title>
                <Space>
                    <Button onClick={() => navigate('/refs')}>Назад к справочникам</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                        Добавить пещеру
                    </Button>
                </Space>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title="Добавить пещеру"
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
                    <Form.Item
                        name="numberOfTreasures"
                        label="Количество сокровищ (можно оставить пустым)"
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (value === null || value === undefined || value === '') {
                                        return Promise.resolve();
                                    }
                                    if (value <= 0) {
                                        return Promise.reject('Значение должно быть больше 0');
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            step={0.1}
                            placeholder="Оставьте пустым для null"
                        />
                    </Form.Item>
                </Form>
            </Modal>

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

export default CavesPage;
