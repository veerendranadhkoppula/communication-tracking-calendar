import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationPanel = ({ companies = [] }) => {
  useEffect(() => {
    // Check if there are any overdue communications
    if (companies.some((company) =>
      company.lastCommunications.some(
        (communication) => new Date(communication.date) < new Date()
      )
    )) {
      toast.info('You have overdue communications with some companies!', {
        position: 'top-right',
      });
    }
  }, [companies]);

  // Filter overdue companies based on the last communication date
  const overdueCompanies = companies
    .map((company) => {
      const overdueCommunications = company.lastCommunications.filter(
        (communication) => new Date(communication.date) < new Date()
      );
      return {
        name: company.name,
        overdueCommunications,
      };
    })
    .filter((company) => company.overdueCommunications.length > 0);

  // Filter companies with communications today
  const todayCompanies = companies
    .map((company) => {
      const todayCommunications = company.lastCommunications.filter(
        (communication) => new Date(communication.date).toDateString() === new Date().toDateString()
      );
      return {
        name: company.name,
        todayCommunications,
      };
    })
    .filter((company) => company.todayCommunications.length > 0);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Company Notifications</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-bold">Overdue Communications</h2>
          {overdueCompanies.length > 0 ? (
            overdueCompanies.map((company, index) => (
              <div key={index} className="bg-red-100 p-2 rounded mb-2">
                <strong>{company.name}</strong>
                {company.overdueCommunications.map((communication, idx) => (
                  <div key={idx}>
                    <span>
                      - Last Communication: {communication.date} - Due {Math.ceil((new Date() - new Date(communication.date)) / (1000 * 3600 * 24))} days ago
                    </span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No overdue communications</div>
          )}
        </div>
        <div>
          <h2 className="font-bold">Today's Communications</h2>
          {todayCompanies.length > 0 ? (
            todayCompanies.map((company, index) => (
              <div key={index} className="bg-yellow-100 p-2 rounded mb-2">
                <strong>{company.name}</strong>
                {company.todayCommunications.map((communication, idx) => (
                  <div key={idx}>
                    <span>- Last Communication: {communication.date}</span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No communications for today</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
