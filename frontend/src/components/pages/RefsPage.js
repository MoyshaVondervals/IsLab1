import React from 'react';
import { Layout, Card, Row, Col, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';


const { Content } = Layout;
const { Title } = Typography;

const RefsPage = () => {
    const navigate = useNavigate();

    const refEntities = [
        {
            key: 'coordinates',
            title: 'Координаты',
            description: 'Управление координатами',
            route: '/coordinates'
        },
        {
            key: 'caves',
            title: 'Пещеры',
            description: 'Управление пещерами с сокровищами',
            route: '/caves'
        },
        {
            key: 'persons',
            title: 'Персонажи',
            description: 'Управление убийцами драконов',
            route: '/persons'
        },
        {
            key: 'heads',
            title: 'Головы драконов',
            description: 'Управление характеристиками голов',
            route: '/heads'
        },
        {
            key: 'locations',
            title: 'Локации',
            description: 'Управление географическими локациями',
            route: '/locations'
        }
    ];


    return (
        <Layout style={{ padding: '20px', background: '#fff' }}>

            <Content>
                <Title level={2} style={{ marginBottom: '30px', textAlign: 'center' }}>
                    Управление справочниками
                </Title>

                <Row gutter={[16, 16]}>
                    {refEntities.map((entity) => (
                        <Col xs={24} sm={12} lg={8} key={entity.key}>
                            <Card
                                title={entity.title}
                                style={{ height: '120px', cursor: 'pointer' }}
                                onClick={() => navigate(entity.route)}
                                hoverable
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{entity.description}</span>
                                    <Button type="primary">Перейти</Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>


            </Content>
        </Layout>
    );
};

export default RefsPage;