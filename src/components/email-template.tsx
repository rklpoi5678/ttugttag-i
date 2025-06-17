import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  message,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>{message}</p>
    <p>귀하의 지원에 감사합니다</p>
  </div>
);