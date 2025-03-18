"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from '@/app/firebaseConfig';

export default function Contacts() {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [contactsPerPage, setContactsPerPage] = useState(3);

    const fileInputRef = useRef(null);

    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router, auth]);


    const [contacts, setContacts] = useState([
        { id: 1, status: 'Active', name: 'Jacob Jones', email: 'jacob@yahoo.com', phone: '(208) 555-0112', company: 'ABC PVT', jobTitle: 'Manager' },
        { id: 2, status: 'Inactive', name: 'Jane Doe', email: 'jane@gmail.com', phone: '(303) 555-0123', company: 'XYZ Inc', jobTitle: 'Developer' },
        { id: 3, status: 'Active', name: 'John Smith', email: 'john@hotmail.com', phone: '(101) 555-0456', company: 'LMN Ltd', jobTitle: 'Designer' },
        { id: 4, status: 'Inactive', name: 'Alice Brown', email: 'alice@gmail.com', phone: '(202) 555-0678', company: 'DEF Co', jobTitle: 'Analyst' },
        { id: 5, status: 'Active', name: 'Michael Clark', email: 'michael@outlook.com', phone: '(404) 555-0789', company: 'GHI Corp', jobTitle: 'Engineer' },
        { id: 6, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 7, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 8, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 9, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 10, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 11, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 12, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 13, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 14, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 15, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 16, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 17, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 18, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 19, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 20, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
        { id: 21, status: 'Inactive', name: 'Sarah Lee', email: 'sarah@live.com', phone: '(505) 555-0890', company: 'JKL Pvt', jobTitle: 'Manager' },
    ]);

    const totalPages = Math.ceil(contacts.length / contactsPerPage);
    const currentContacts = contacts.slice((currentPage - 1) * contactsPerPage, currentPage * contactsPerPage);


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleContactsPerPageChange = (e) => {
        setContactsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };


    const handleSelectContact = (id) => {
        setSelectedContacts(prev =>
            prev.includes(id) ? prev.filter(contactId => contactId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        const currentPageContactIds = currentContacts.map(contact => contact.id);
        const allSelected = currentPageContactIds.every(id => selectedContacts.includes(id));

        if (allSelected) {
            setSelectedContacts(prev => prev.filter(id => !currentPageContactIds.includes(id)));
        } else {
            setSelectedContacts(prev => [...new Set([...prev, ...currentPageContactIds])]);
        }
    };

    const handleDeleteSelected = () => {
        setContacts(prev => prev.filter(contact => !selectedContacts.includes(contact.id)));
        setSelectedContacts([]);
    };

    const handleExportSelected = () => {
        let selectedData = contacts.filter(contact => selectedContacts.includes(contact.id));
        if (selectedData.length === 0) {
            selectedData = [...contacts];
        }
        const csvContent = "data:text/csv;charset=utf-8," +
            ["Name,Email,Phone,Company,Job Title"].concat(
                selectedData.map(c => `${c.name},${c.email},${c.phone},${c.company},${c.jobTitle}`)
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "contacts.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBulkImport = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const csvData = e.target.result.split("\n").slice(1); // Ignore header row
            const newContacts = csvData.map((row, index) => {
                const [name, email, phone, company, jobTitle] = row.split(",");
                return {
                    id: Date.now() + index,
                    status: "Active",
                    name: name,
                    email: email,
                    phone: phone,
                    company: company,
                    jobTitle: jobTitle,
                };
            }).filter(contact => contact.name && contact.email);

            setContacts((prev) => [...prev, ...newContacts]);

            // Reset input via ref
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        };
        reader.readAsText(file);
    };

    const renderPagination = () => {
        const pageButtons = [];
        const maxPagesToShow = Math.min(5, totalPages);

        if (totalPages <= maxPagesToShow) {
            for (let page = 1; page <= totalPages; page++) {
                pageButtons.push(page);
            }
        } else {
            pageButtons.push(1);
            if (currentPage > 3) pageButtons.push('...');
            for (let page = Math.max(2, currentPage - 1); page <= Math.min(totalPages - 1, currentPage + 1); page++) {
                pageButtons.push(page);
            }
            if (currentPage < totalPages - 2) pageButtons.push('...');
            pageButtons.push(totalPages);
        }

        return pageButtons.map((page, index) => (
            <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                className={`btn mx-1 ${page === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
                disabled={page === '...'}
            >
                {page}
            </button>
        ));
    };


    return loading ? <p>Loading...</p> : (
        <div className="container-fluid p-4" style={{ background: '#f0f8ff' }}>
            {/* Stats Section */}
            <div className="row mb-4 text-center">
                {[{ label: 'Total Contacts', value: contacts.length }, { label: 'New Contacts', value: '342' }, { label: 'Active', value: contacts.filter(c => c.status === 'Active').length }].map((item, index) => (
                    <div key={index} className="col-lg-4 col-md-6 mb-3">
                        <div className="p-4 bg-white rounded shadow-sm">
                            <h6>{item.label}</h6>
                            <h3>{item.value}</h3>
                            <small className={index === 1 ? 'text-danger' : 'text-success'}>
                                {index === 1 ? '↓ 1% this month' : '↑ 16% this year'}
                            </small>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contacts Table */}
            <div className="bg-white rounded shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>All Contacts</h4>
                    <div>
                        <button onClick={handleExportSelected} className="btn btn-primary me-2">Export</button>
                        <button onClick={() => document.getElementById('bulk-upload').click()} className="btn btn-primary me-2">
                            Bulk Upload
                        </button>
                        <button onClick={handleDeleteSelected} className="btn btn-danger me-2">Delete</button>

                        <input id='bulk-upload' ref={fileInputRef} type="file" accept=".csv" onChange={handleBulkImport} className="form-control d-inline w-auto d-none" />

                    </div>
                </div>

                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th><input type="checkbox" onChange={handleSelectAll} checked={currentContacts.every(contact => selectedContacts.includes(contact.id))} /></th>
                                <th>Status</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Company Name</th>
                                <th>Job Title</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentContacts.map(contact => (
                                <tr key={contact.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedContacts.includes(contact.id)}
                                            onChange={() => handleSelectContact(contact.id)}
                                        />
                                    </td>
                                    <td>
                                        <span className={`badge ${contact.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                                            {contact.status}
                                        </span>
                                    </td>
                                    <td>{contact.name}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.phone}</td>
                                    <td>{contact.company}</td>
                                    <td>{contact.jobTitle}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-3 d-flex justify-content-between">

                    <div className='d-flex align-items-center'>
                        <label className="me-2">Contacts per page:</label>
                        <select value={contactsPerPage} onChange={handleContactsPerPageChange} className="form-select w-auto me-3">
                            {[3, 5, 10, contacts.length].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="btn btn-outline-primary mx-1"
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        {renderPagination()}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="btn btn-outline-primary mx-1"
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
