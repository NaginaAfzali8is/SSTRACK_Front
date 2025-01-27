import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const statsTranslations = {
  en: {
    title: "Each month",
    stats: [
      { value: '5K+', label: 'Active users' },
      { value: '1M+', label: 'Total hours tracked' },
      { value: '4M+', label: 'Tasks completed' },
      { value: '300K+', label: 'Payments' },
    ],
  },
  ar: {
    title: "كل شهر",
    stats: [
      { value: '5K+', label: 'المستخدمين النشطين' },
      { value: '1M+', label: 'إجمالي الساعات المتعقبة' },
      { value: '4M+', label: 'المهام المكتملة' },
      { value: '300K+', label: 'المدفوعات' },
    ],
  },
};

const StatsSection = ({ language }) => {
  const currentStats = statsTranslations[language];

  return (
    <Container fluid className="text-center bg-white py-5">
      <p
        className="mb-4"
        style={{
          fontFamily: "'Sinkin Sans', sans-serif",
          fontSize: '15px',
          fontWeight: '400',
          color: '#253053',
          letterSpacing: '0.5px',
        }}
      >
        {currentStats.title}
      </p>
      <Row>
        {currentStats.stats.map((stat, index) => (
          <Col
            key={index}
            xs={12}
            sm={6}
            md={3}
            className={`d-flex flex-column align-items-center ${
              index < 3 ? 'border-end border-md-end' : ''
            }`}
            style={{ borderColor: '#E0E0E0' }}
          >
            <p
              className="mb-1 "
              style={{
                color: '#7ACB59',
                fontSize: '2rem',
                fontFamily: "'Sinkin Sans', sans-serif",
                fontWeight: '500',
              }}
            >
              {stat.value}
            </p>
            <p
              className="text-muted"
              style={{
                fontSize: '14px',
                fontFamily: "'Sinkin Sans', sans-serif",
                fontWeight: '400',
              }}
            >
              {stat.label}
            </p>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default StatsSection;
