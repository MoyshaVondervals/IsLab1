import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Layout, Typography, InputNumber, Button, Space, message, DatePicker } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function OperationsPage() {
    const token = useSelector((state) => state.auth.token);

    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    // фильтры под DTO
    const [filters, setFilters] = useState({
        idFrom: undefined,
        idTo: undefined,
        ownerId: undefined,
        affectedFrom: undefined,
        affectedTo: undefined,
        dateFrom: null,   // dayjs | null
        dateTo: null,     // dayjs | null
    });

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get("/getHistory", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = Array.isArray(res.data) ? res.data : [];
            setRows(
                data.map((it) => ({
                    // страхуемся от кривых бек-значений
                    id: it.id,
                    operationOwner: it.operationOwner || null, // { id, ... } или null
                    affectedObjects: typeof it.affectedObjects === "number" ? it.affectedObjects : Number(it.affectedObjects || 0),
                    creationDate: it.creationDate, // ISO строка
                }))
            );
        } catch (e) {
            const msg = e.response
                ? `Ошибка ${e.response.status}: ${
                    typeof e.response.data === "string" ? e.response.data : JSON.stringify(e.response.data)
                }`
                : e.message;
            message.error(`Не удалось загрузить историю: ${msg}`);
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Клиентская фильтрация
    const filteredRows = useMemo(() => {
        return rows.filter((r) => {
            // ID
            if (filters.idFrom !== undefined && !(r.id >= filters.idFrom)) return false;
            if (filters.idTo !== undefined && !(r.id <= filters.idTo)) return false;

            // Owner ID
            const ownerId = r.operationOwner?.id;
            if (filters.ownerId !== undefined && ownerId !== filters.ownerId) return false;

            // affectedObjects
            if (filters.affectedFrom !== undefined && !(r.affectedObjects >= filters.affectedFrom)) return false;
            if (filters.affectedTo !== undefined && !(r.affectedObjects <= filters.affectedTo)) return false;

            // дата
            if (filters.dateFrom) {
                const d = dayjs(r.creationDate);
                if (!d.isValid() || d.isBefore(filters.dateFrom, "second")) {
                    return false;
                }
            }
            if (filters.dateTo) {
                const d = dayjs(r.creationDate);
                if (!d.isValid() || d.isAfter(filters.dateTo, "second")) {
                    return false;
                }
            }

            return true;
        });
    }, [rows, filters]);

    const RangeDropdown = ({ valueFrom, valueTo, onChangeFrom, onChangeTo, onApply, onClear, labelFrom = "От", labelTo = "До" }) => (
        <div style={{ padding: 12, width: 260 }}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Space>
                    <span style={{ width: 60 }}>{labelFrom}</span>
                    <InputNumber
                        value={valueFrom}
                        onChange={(v) => onChangeFrom(v === null ? undefined : v)}
                        min={0}
                        precision={0}
                        style={{ width: 160 }}
                    />
                </Space>
                <Space>
                    <span style={{ width: 60 }}>{labelTo}</span>
                    <InputNumber
                        value={valueTo}
                        onChange={(v) => onChangeTo(v === null ? undefined : v)}
                        min={0}
                        precision={0}
                        style={{ width: 160 }}
                    />
                </Space>
                <Space>
                    <Button type="primary" icon={<SearchOutlined />} onClick={onApply}>
                        Применить
                    </Button>
                    <Button icon={<ClearOutlined />} onClick={onClear}>
                        Сбросить
                    </Button>
                </Space>
            </Space>
        </div>
    );

    const OwnerIdDropdown = ({ value, onChange, onApply, onClear }) => (
        <div style={{ padding: 12, width: 260 }}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Space>
                    <span style={{ width: 120 }}>ID владельца</span>
                    <InputNumber
                        value={value}
                        onChange={(v) => onChange(v === null ? undefined : v)}
                        min={1}
                        precision={0}
                        style={{ width: 120 }}
                    />
                </Space>
                <Space>
                    <Button type="primary" icon={<SearchOutlined />} onClick={onApply}>
                        Применить
                    </Button>
                    <Button icon={<ClearOutlined />} onClick={onClear}>
                        Сбросить
                    </Button>
                </Space>
            </Space>
        </div>
    );

    const DateDropdown = ({ from, to, onChange, onApply, onClear }) => (
        <div style={{ padding: 12, width: 320 }}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <RangePicker
                    showTime
                    value={[from, to]}
                    onChange={(vals) => onChange(vals?.[0] || null, vals?.[1] || null)}
                    style={{ width: "100%" }}
                />
                <Space>
                    <Button type="primary" icon={<SearchOutlined />} onClick={onApply}>
                        Применить
                    </Button>
                    <Button icon={<ClearOutlined />} onClick={onClear}>
                        Сбросить
                    </Button>
                </Space>
            </Space>
        </div>
    );

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            width: 120,
            sorter: (a, b) => a.id - b.id,
            render: (v) => <Text code>#{v}</Text>,
            filterDropdown: ({ confirm, clearFilters }) => (
                <RangeDropdown
                    valueFrom={filters.idFrom}
                    valueTo={filters.idTo}
                    onChangeFrom={(val) => setFilters((f) => ({ ...f, idFrom: val }))}
                    onChangeTo={(val) => setFilters((f) => ({ ...f, idTo: val }))}
                    onApply={() => {
                        setPage(1);
                        confirm();
                    }}
                    onClear={() => {
                        setFilters((f) => ({ ...f, idFrom: undefined, idTo: undefined }));
                        setPage(1);
                        clearFilters?.();
                    }}
                />
            ),
            filteredValue: [filters.idFrom, filters.idTo].some((v) => v !== undefined) ? ["applied"] : null,
            onFilter: () => true,
        },
        {
            title: "ID владельца",
            dataIndex: ["operationOwner", "id"],
            width: 160,
            render: (_, r) => <Text>{r.operationOwner?.id ?? "—"}</Text>,
            filterDropdown: ({ confirm, clearFilters }) => (
                <OwnerIdDropdown
                    value={filters.ownerId}
                    onChange={(val) => setFilters((f) => ({ ...f, ownerId: val }))}
                    onApply={() => {
                        setPage(1);
                        confirm();
                    }}
                    onClear={() => {
                        setFilters((f) => ({ ...f, ownerId: undefined }));
                        setPage(1);
                        clearFilters?.();
                    }}
                />
            ),
            filteredValue: filters.ownerId !== undefined ? [String(filters.ownerId)] : null,
            onFilter: () => true,
        },
        {
            title: "Затронуто объектов",
            dataIndex: "affectedObjects",
            width: 220,
            sorter: (a, b) => a.affectedObjects - b.affectedObjects,
            render: (v) => <Text strong>{v}</Text>,
            filterDropdown: ({ confirm, clearFilters }) => (
                <RangeDropdown
                    valueFrom={filters.affectedFrom}
                    valueTo={filters.affectedTo}
                    onChangeFrom={(val) => setFilters((f) => ({ ...f, affectedFrom: val }))}
                    onChangeTo={(val) => setFilters((f) => ({ ...f, affectedTo: val }))}
                    onApply={() => {
                        setPage(1);
                        confirm();
                    }}
                    onClear={() => {
                        setFilters((f) => ({ ...f, affectedFrom: undefined, affectedTo: undefined }));
                        setPage(1);
                        clearFilters?.();
                    }}
                    labelFrom="Мин"
                    labelTo="Макс"
                />
            ),
            filteredValue: [filters.affectedFrom, filters.affectedTo].some((v) => v !== undefined) ? ["applied"] : null,
            onFilter: () => true,
        },
        {
            title: "Дата создания",
            dataIndex: "creationDate",
            width: 240,
            sorter: (a, b) => dayjs(a.creationDate).valueOf() - dayjs(b.creationDate).valueOf(),
            render: (v) => {
                const d = dayjs(v);
                return d.isValid() ? (
                    <Space direction="vertical" size={0}>
                        <Text>{d.format("YYYY-MM-DD HH:mm:ss")}</Text>
                        <Text type="secondary">{d.fromNow?.() || ""}</Text>
                    </Space>
                ) : (
                    <Text type="secondary">—</Text>
                );
            },
            filterDropdown: ({ confirm, clearFilters }) => (
                <DateDropdown
                    from={filters.dateFrom}
                    to={filters.dateTo}
                    onChange={(from, to) => setFilters((f) => ({ ...f, dateFrom: from, dateTo: to }))}
                    onApply={() => {
                        setPage(1);
                        confirm();
                    }}
                    onClear={() => {
                        setFilters((f) => ({ ...f, dateFrom: null, dateTo: null }));
                        setPage(1);
                        clearFilters?.();
                    }}
                />
            ),
            filteredValue: filters.dateFrom || filters.dateTo ? ["applied"] : null,
            onFilter: () => true,
        },
    ];

    const handleTableChange = (pagination) => {
        if (pagination.current !== page) setPage(pagination.current);
        if (pagination.pageSize !== pageSize) setPageSize(pagination.pageSize);
    };

    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredRows.slice(start, start + pageSize);
    }, [filteredRows, page, pageSize]);

    return (
        <Layout style={{ background: "#fff" }}>
            <Content style={{ padding: 24 }}>
                <Title level={4} style={{ marginBottom: 16 }}>
                    История операций
                </Title>

                <Space style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={fetchHistory} loading={loading}>
                        Обновить
                    </Button>
                    <Button
                        onClick={() =>
                            setFilters({
                                idFrom: undefined,
                                idTo: undefined,
                                ownerId: undefined,
                                affectedFrom: undefined,
                                affectedTo: undefined,
                                dateFrom: null,
                                dateTo: null,
                            })
                        }
                    >
                        Сбросить все фильтры
                    </Button>
                </Space>

                <Table
                    rowKey={(r) => r.id}
                    columns={columns}
                    dataSource={paginatedData}
                    loading={loading}
                    onChange={handleTableChange}
                    pagination={{
                        current: page,
                        pageSize,
                        total: filteredRows.length,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 50, 100],
                    }}
                    bordered
                />
            </Content>
        </Layout>
    );
}
