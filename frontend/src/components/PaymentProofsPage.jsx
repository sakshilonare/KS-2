import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentProofsPage = () => {
    const [paymentProofs, setPaymentProofs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [proofDetail, setProofDetail] = useState(null);
    const [status, setStatus] = useState("");
    const [amount, setAmount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPaymentProofs() {
            try {
                const response = await axios.get("http://localhost:3000/api/admin/paymentproofs/getall", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.data.success) {
                    setPaymentProofs(response.data.paymentProofs);
                }
            } catch (error) {
                console.error("Error fetching payment proofs:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPaymentProofs();
    }, []);

    const handleViewDetails = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/admin/paymentproofs/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.data.success) {
                setProofDetail(response.data.paymentProofDetail);
                setStatus(response.data.paymentProofDetail.status);
                setAmount(response.data.paymentProofDetail.amount || 0);
                setModalVisible(true);
            }
        } catch (error) {
            console.error("Error fetching proof details:", error);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            const response = await axios.put(
                `http://localhost:3000/api/admin/paymentproofs/status/update/${proofDetail._id}`,
                { status, amount },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.success) {
                alert(response.data.message);
                setModalVisible(false);
                setProofDetail(null);
            }
        } catch (error) {
            console.error("Error updating payment proof status:", error);
            alert("Failed to update status.");
        }
    };

    return (
        <div className="min-h-screen bg-black-100 p-8">
        <div className="grid grid-cols-1 gap-8 mb-8">
            <div className="bg-gray-900 shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-white">Payment Proofs</h2>
                {isLoading ? (
                    <p className="text-white">Loading...</p>
                ) : (
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-slate-700">
                                <th className="border border-gray-200 p-2 text-white">ID</th>
                                <th className="border border-gray-200 p-2 text-white">Status</th>
                                <th className="border border-gray-200 p-2 text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentProofs.length > 0 ? (
                                paymentProofs.map((proof) => (
                                    <tr key={proof._id} className="text-center text-white">
                                        <td className="border border-gray-200 p-2">{proof._id}</td>
                                        <td className="border border-gray-200 p-2">{proof.status}</td>
                                        <td className="border border-gray-200 p-2">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                                onClick={() => handleViewDetails(proof._id)}
                                            >
                                                Verify Proof
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        className="border border-gray-200 p-2 text-center text-white"
                                        colSpan="3"
                                    >
                                        No payment proofs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal for Proof Detail */}
            {modalVisible && proofDetail && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-slate-900 p-8 rounded-lg w-1/2 ">
                        <h3 className="text-2xl font-bold mb-4">Payment Proof Details</h3>
                        <p><strong>ID:</strong> {proofDetail._id}</p>
                        <p><strong>Status:</strong> {proofDetail.status}</p>
                        <p><strong>Amount:</strong> {proofDetail.amount || "Not Provided"}</p>
                        <p><strong>Uploaded At:</strong> {new Date(proofDetail.uploadedAt).toLocaleDateString()}</p>
                        <img src={proofDetail.proof.url} alt="Proof Document" style={{ maxWidth: "300px" }} />

                        <div className="form-group my-4">
                            <label htmlFor="status" className="block text-lg mb-2">Update Status</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full p-2 border border-slate-500 bg-slate-500 rounded"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="amount" className="block text-lg mb-2">Amount</label>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-2 border border-slate-500 bg-slate-500 rounded"
                            />
                        </div>

                        <div className="flex justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                                onClick={handleUpdateStatus}
                            >
                                Update Proof
                            </button>
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
                                onClick={() => setModalVisible(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default PaymentProofsPage;
