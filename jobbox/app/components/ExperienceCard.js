import React from 'react';

const ExperienceCard = ({ position, company, content }) => {
  const cardStyles = {
    root: {
      backgroundColor: '#ffffff',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      margin: '20px',
    },
    header: {
      backgroundColor: '#f5f5f5',
      padding: '10px',
    },
    title: {
      margin: '0',
      fontSize: '18px',
    },
    subtitle: {
      margin: '0',
      fontSize: '14px',
      color: '#888888',
    },
    content: {
      padding: '10px',
    },
    text: {
      margin: '0',
      fontSize: '16px',
    },
  };

  return (
    <div style={cardStyles.root}>
      <div style={cardStyles.header}>
        <h3 style={cardStyles.title}>{position}</h3>
        <h4 style={cardStyles.subtitle}>{company}</h4>
      </div>
      <div style={cardStyles.content}>
        <p style={cardStyles.text}>{content}</p>
      </div>
    </div>
  );
};

export default ExperienceCard;
