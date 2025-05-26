"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
    collection,
    getDocs,
    Timestamp,
    doc,
    updateDoc,
    setDoc,
} from "firebase/firestore";

type User = {
    id: string;
    email: string;
    name: string;
    account: string;
    user: string;
    ipAddress: string;
    joined: Timestamp | string;
    status: string;
};

export default function AdminUsersList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "users"));
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as User[];
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const updateUserStatus = async (userId: string, status: string) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { status });

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, status } : user
                )
            );
        } catch (error) {
            console.error("Error updating user status:", error);
        }
    };

    const banIp = async (ipAddress: string) => {
        try {
            const bannedIpRef = doc(db, "bannedIps", ipAddress);
            await setDoc(bannedIpRef, { banned: true });
            alert(`IP ${ipAddress} banned.`);
        } catch (error) {
            console.error("Error banning IP:", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Registered Users</h1>

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <ul className="space-y-2">
                    {users.map((user, index) => {
                        const joinedDate =
                            typeof user.joined === "string"
                                ? new Date(user.joined)
                                : user.joined instanceof Timestamp
                                    ? user.joined.toDate()
                                    : new Date();

                        return (
                            <li
                                key={index}
                                className="border p-2 rounded space-y-1 bg-white"
                            >
                                <div>
                                    <strong>Email:</strong> {user.email}
                                </div>
                                <div>
                                    <strong>Name:</strong> {user.name}
                                </div>
                                <div>
                                    <strong>Account:</strong> {user.account}
                                </div>
                                <div>
                                    <strong>User:</strong> {user.user}
                                </div>
                                <div>
                                    <strong>IP Address:</strong> {user.ipAddress}
                                </div>
                                <div>
                                    <strong>Joined:</strong>{" "}
                                    {joinedDate.toLocaleString()}
                                </div>
                                <div>
                                    <strong>Status:</strong> {user.status}
                                </div>

                                <div className="space-x-2 mt-2">
                                    {user.status === "disabled" ? (
                                        <button
                                            className="bg-green-600 px-2 py-1 text-white rounded"
                                            onClick={() =>
                                                updateUserStatus(user.id, "active")
                                            }
                                        >
                                            Enable Account
                                        </button>
                                    ) : (
                                        <button
                                            className="bg-yellow-500 px-2 py-1 text-white rounded"
                                            onClick={() =>
                                                updateUserStatus(user.id, "disabled")
                                            }
                                        >
                                            Disable Account
                                        </button>
                                    )}

                                    <button
                                        className="bg-red-600 px-2 py-1 text-white rounded"
                                        onClick={() => updateUserStatus(user.id, "banned")}
                                    >
                                        Ban Account
                                    </button>

                                    <button
                                        className="bg-gray-700 px-2 py-1 text-white rounded"
                                        onClick={() => banIp(user.ipAddress)}
                                    >
                                        Ban IP
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
