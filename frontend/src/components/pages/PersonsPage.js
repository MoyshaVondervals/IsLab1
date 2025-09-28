import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Typography, Card, Tag, Alert } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useApiClient from '../../utils/requestController';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;
const { Option } = Select;

const COLOR_ENUM = ["RED", "BLACK", "YELLOW", "WHITE", "BROWN"];
const COUNTRY_ENUM = ["FRANCE", "SPAIN", "VATICAN", "ITALY", "NORTH_KOREA"];

const PersonsPage = () => {
    const navigate = useNavigate();
    const api = useApiClient();
    const token = useSelector((state) => state.auth.token);

    const [data, setData] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [saveLoading, setSaveLoading] = useState(false);

    // --- Уведомления пользователя (аналогично CavesPage) ---
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

    // фильтры
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        eyeColor: '',
        hairColor: '',
        passportID: '',
        nationality: '',
        location: ''
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            id: '',
            name: '',
            eyeColor: '',
            hairColor: '',
            passportID: '',
            nationality: '',
            location: ''
        });
    };

    // клиентская фильтрация данных
    const filteredData = data.filter(item => {
        const idMatch = !filters.id || String(item.id).includes(filters.id.trim());
        const nameMatch = !filters.name || (item.name || '').toLowerCase().includes(filters.name.toLowerCase());
        const eyeColorMatch = !filters.eyeColor || (item.eyeColor || '').toLowerCase().includes(filters.eyeColor.toLowerCase());
        const hairColorMatch = !filters.hairColor || (item.hairColor || '').toLowerCase().includes(filters.hairColor.toLowerCase());
        const passportMatch = !filters.passportID || (item.passportID || '').toLowerCase().includes(filters.passportID.toLowerCase());
        const nationalityMatch = !filters.nationality || (item.nationality || '').toLowerCase().includes(filters.nationality.toLowerCase());
        const locationName = item.location?.name || '';
        const locationCoords = item.location ? `${item.location.x},${item.location.y},${item.location.z}` : '';
        const locationMatch = !filters.location || `${locationName} ${locationCoords}`.toLowerCase().includes(filters.location.toLowerCase());

        return idMatch && nameMatch && eyeColorMatch && hairColorMatch && passportMatch && nationalityMatch && locationMatch;
    });

    const columns = [
        {
            title: (
                <div>
                    ID
                    <Input size="small" placeholder="Фильтр" style={{ marginTop: 6 }} value={filters.id} onChange={e => handleFilterChange('id', e.target.value)} />
                </div>
            ),
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: (
                <div>
                    Имя
                    <Input size="small" placeholder="Фильтр" style={{ marginTop: 6 }} value={filters.name} onChange={e => handleFilterChange('name', e.target.value)} />
                </div>
            ),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: (
                <div>
                    Цвет глаз
                    <Input size="small" placeholder="Фильтр" style={{ marginTop: 6 }} value={filters.eyeColor} onChange={e => handleFilterChange('eyeColor', e.target.value)} />
                </div>
            ),
            dataIndex: 'eyeColor',
            key: 'eyeColor',
            render: (color) => color ? <Tag color={color.toLowerCase()}>{color}</Tag> : '—'
        },
        {
            title: (
                <div>
                    Цвет волос
                    <Input size="small" placeholder="Фильтр" style={{ marginTop: 6 }} value={filters.hairColor} onChange={e => handleFilterChange('hairColor', e.target.value)} />
                </div>
            ),
            dataIndex: 'hairColor',
            key: 'hairColor',
            render: (color) => color ? <Tag color={color.toLowerCase()}>{color}</Tag> : '—'
        },
        {
            title: (
                <div>
                    Паспорт
                    <Input size="small" placeholder="Фильтр" style={{ marginTop: 6 }} value={filters.passportID} onChange={e => handleFilterChange('passportID', e.target.value)} />
                </div>
            ),
            dataIndex: 'passportID',
            key: 'passportID',
        },
        {
            title: (
                <div>
                    Национальность
                    <Input size="small" placeholder="Фильтр" style={{ marginTop: 6 }} value={filters.nationality} onChange={e => handleFilterChange('nationality', e.target.value)} />
                </div>
            ),
            dataIndex: 'nationality',
            key: 'nationality',
            render: (country) => country ? <Tag color="blue">{country}</Tag> : '—'
        },
        {
            title: (
                <div>
                    Локация
                    <Input size="small" placeholder="Фильтр" style={{ marginTop: 6 }} value={filters.location} onChange={e => handleFilterChange('location', e.target.value)} />
                </div>
            ),
            dataIndex: ['location', 'name'],
            key: 'location',
            render: (name, record) => record.location ?
                `${name || 'Без названия'} (${record.location.x}, ${record.location.y}, ${record.location.z})` : '—'
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button size="small" danger onClick={() => handleDelete(record.id)}>Удалить</Button>
                </Space>
            ),
        },
    ];

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/getPerson', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setData(response?.data || []);
        } catch (error) {
            notify('error', 'Ошибка загрузки персонажей');
        } finally {
            setLoading(false);
        }
    };

    const loadLocations = async () => {
        setLoadingLocations(true);
        try {
            const response = await api.get('/getLocation', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setLocations(response?.data || []);
        } catch (error) {
            notify('error', 'Ошибка загрузки локаций');
        } finally {
            setLoadingLocations(false);
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setSaveLoading(true);

            const locationId = values.locationId ? parseInt(values.locationId, 10) : null;

            const payload = {
                name: values.name,
                eyeColor: values.eyeColor,
                hairColor: values.hairColor || null,
                passportID: values.passportID,
                nationality: values.nationality,
                location: locationId ? { id: locationId } : null
            };

            await api.post('/createPerson', payload, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            notify('success', 'Персонаж создан');
            setModalVisible(false);
            form.resetFields();
            loadData();
        } catch (error) {
            if (error?.errorFields) {
                notify('warning', 'Пожалуйста, заполните все обязательные поля правильно');
            } else {
                notify('error', 'Ошибка сохранения');
            }
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/deletePersonById/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            notify('success', 'Персонаж удален');
            loadData();
        } catch (error) {
            notify('error', 'Ошибка удаления');
        }
    };

    useEffect(() => {
        loadData();
        loadLocations();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Title level={3}>Управление персонажами</Title>
                <Space>
                    <Button onClick={() => navigate('/refs')}>Назад к справочникам</Button>
                    <Button icon={<ReloadOutlined />} onClick={resetFilters}>Сбросить фильтры</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>Добавить персонажа</Button>
                </Space>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1000 }}
                />
            </Card>

            <Modal
                title="Добавить персонажа"
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText="Сохранить"
                cancelText="Отмена"
                width={600}
                confirmLoading={saveLoading}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Введите имя' }]}>
                        <Input placeholder="Имя персонажа" />
                    </Form.Item>

                    <Form.Item name="eyeColor" label="Цвет глаз" rules={[{ required: true, message: 'Выберите цвет глаз' }]}>
                        <Select placeholder="Выберите цвет глаз">
                            {COLOR_ENUM.map(color => <Option key={color} value={color}>{color}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="hairColor" label="Цвет волос (можно оставить пустым)">
                        <Select placeholder="Выберите цвет волос" allowClear>
                            {COLOR_ENUM.map(color => <Option key={color} value={color}>{color}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="passportID" label="Паспорт ID" rules={[{ required: true, message: 'Введите паспорт ID' }]}>
                        <Input placeholder="Номер паспорта" />
                    </Form.Item>

                    <Form.Item name="nationality" label="Национальность" rules={[{ required: true, message: 'Выберите национальность' }]}>
                        <Select placeholder="Выберите национальность">
                            {COUNTRY_ENUM.map(country => <Option key={country} value={country}>{country}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="locationId" label="Локация (можно оставить пустым)">
                        <Select placeholder="Выберите локацию" allowClear loading={loadingLocations}>
                            {locations.map(location => (
                                <Option key={location.id} value={location.id}>
                                    {location.name || 'Без названия'} ({location.x}, {location.y}, {location.z})
                                </Option>
                            ))}
                        </Select>
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

export default PersonsPage;
