import React, { useEffect, useRef, useState } from "react";
import { User } from "@/services/userService";
import { io, Socket } from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";

let socket: Socket | null = null;

const UserList: React.FC = () => {
  const [showUsers, setShowUsers] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const usersEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    socket = io("http://localhost:8000", {
      query: {
        userId: user.id,
      },
    });

    socket.on("clientListFromServer", (users: User[]) => {
      setConnectedUsers(users);
    });

    return () => {
      socket?.disconnect();
    };
  }, [user?.id]);

  const toggleUsers = () => {
    setShowUsers((prev) => !prev);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={toggleUsers}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        {showUsers ? "Masquer les utilisateurs" : "Afficher les utilisateurs"}
      </button>

      {showUsers && (
        <>
          {connectedUsers.length === 0 ? (
            <div className="text-center">Aucun utilisateur connecté</div>
          ) : (
            connectedUsers
              .slice()
              .sort((a, b) => {
                const aTime = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
                const bTime = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
                return bTime - aTime;
              })
              .map((user) => (
                <div
                  key={user.id}
                  className="rounded bg-white p-3 shadow-sm text-gray-800"
                >
                  <p>{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Dernière connexion :{" "}
                    {user.lastSeen
                      ? formatDistanceToNow(new Date(user.lastSeen), {
                          addSuffix: true,
                          locale: fr,
                        })
                      : "jamais connecté"}
                  </p>
                </div>
              ))
          )}
          <div ref={usersEndRef} />
        </>
      )}
    </div>
  );
};

export default UserList;
