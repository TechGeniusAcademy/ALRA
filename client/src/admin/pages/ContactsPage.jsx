import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import contactService from '../services/contactService';
import './ContactsPage.css';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [statusFilter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getAllContacts(statusFilter);
      console.log('Contacts response:', response);
      setContacts(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err.message || 'Ошибка загрузки сообщений');
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await contactService.updateContact(id, { status: newStatus });
      // Обновляем список сообщений
      setContacts(contacts.map(contact => 
        contact.id === id 
          ? { ...contact, status: newStatus } 
          : contact
      ));
    } catch (err) {
      setError(err.message || 'Ошибка обновления статуса сообщения');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это сообщение?')) {
      try {
        await contactService.deleteContact(id);
        setContacts(contacts.filter(contact => contact.id !== id));
      } catch (err) {
        setError(err.message || 'Ошибка удаления сообщения');
      }
    }
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setSelectedContact(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'unread':
        return 'status-badge status-unread';
      case 'read':
        return 'status-badge status-read';
      case 'replied':
        return 'status-badge status-replied';
      default:
        return 'status-badge';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'unread':
        return 'Непрочитано';
      case 'read':
        return 'Прочитано';
      case 'replied':
        return 'Отвечено';
      default:
        return status;
    }
  };

  return (
    <AdminLayout title="Сообщения от клиентов">
      <div className="contacts-container">
        <div className="contacts-header">
          <h2>Список сообщений</h2>
          <div className="contacts-filter">
            <label htmlFor="statusFilter">Фильтр по статусу:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Все сообщения</option>
              <option value="unread">Непрочитанные</option>
              <option value="read">Прочитанные</option>
              <option value="replied">Отвеченные</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="contacts-loading">Загрузка сообщений...</div>
        ) : error ? (
          <div className="contacts-error">{error}</div>
        ) : contacts.length === 0 ? (
          <div className="contacts-empty">
            <p>Сообщения не найдены.</p>
          </div>
        ) : (
          <div className="contacts-table-container">
            <table className="contacts-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя</th>
                  <th>Email</th>
                  <th>Тема</th>
                  <th>Дата</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(contact => (
                  <tr key={contact.id} className={contact.status === 'unread' ? 'unread-row' : ''}>
                    <td>{contact.id}</td>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td className="subject-cell">{contact.subject}</td>
                    <td>{formatDate(contact.createdAt)}</td>
                    <td>
                      <span className={getStatusBadgeClass(contact.status)}>
                        {getStatusText(contact.status)}
                      </span>
                    </td>
                    <td>
                      <div className="contact-actions">
                        <button
                          className="view-button"
                          onClick={() => handleViewContact(contact)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        {contact.status === 'unread' && (
                          <button
                            className="mark-read-button"
                            onClick={() => handleStatusChange(contact.id, 'read')}
                          >
                            <i className="fas fa-envelope-open"></i>
                          </button>
                        )}
                        {contact.status !== 'replied' && (
                          <button
                            className="mark-replied-button"
                            onClick={() => handleStatusChange(contact.id, 'replied')}
                          >
                            <i className="fas fa-reply"></i>
                          </button>
                        )}
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(contact.id)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Модальное окно просмотра сообщения */}
        {showContactModal && selectedContact && (
          <div className="contact-modal-overlay">
            <div className="contact-modal">
              <h3>Просмотр сообщения</h3>
              
              <div className="contact-details">
                <div className="contact-detail">
                  <span className="detail-label">От:</span>
                  <span className="detail-value">{selectedContact.name}</span>
                </div>
                
                <div className="contact-detail">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">
                    <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
                  </span>
                </div>
                
                <div className="contact-detail">
                  <span className="detail-label">Телефон:</span>
                  <span className="detail-value">
                    {selectedContact.phone || 'Не указан'}
                  </span>
                </div>
                
                <div className="contact-detail">
                  <span className="detail-label">Дата:</span>
                  <span className="detail-value">{formatDate(selectedContact.createdAt)}</span>
                </div>
                
                <div className="contact-detail">
                  <span className="detail-label">Тема:</span>
                  <span className="detail-value">{selectedContact.subject}</span>
                </div>
              </div>
              
              <div className="contact-message">
                <h4>Сообщение:</h4>
                <div className="message-content">{selectedContact.message}</div>
              </div>
              
              <div className="contact-modal-actions">
                {selectedContact.status === 'unread' && (
                  <button
                    className="mark-read-button modal-button"
                    onClick={() => {
                      handleStatusChange(selectedContact.id, 'read');
                      setSelectedContact({...selectedContact, status: 'read'});
                    }}
                  >
                    <i className="fas fa-envelope-open"></i> Отметить как прочитанное
                  </button>
                )}
                
                {selectedContact.status !== 'replied' && (
                  <button
                    className="mark-replied-button modal-button"
                    onClick={() => {
                      handleStatusChange(selectedContact.id, 'replied');
                      setSelectedContact({...selectedContact, status: 'replied'});
                    }}
                  >
                    <i className="fas fa-reply"></i> Отметить как отвеченное
                  </button>
                )}
                
                <button className="email-reply-button modal-button">
                  <i className="fas fa-paper-plane"></i> 
                  <a 
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ответить по email
                  </a>
                </button>
                
                <button className="close-button modal-button" onClick={closeContactModal}>
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContactsPage; 