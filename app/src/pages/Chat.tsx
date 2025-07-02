import { useAuth } from "@/contexts/AuthContext";
import MessageForm from "../components/chat/MessageForm";
import MessageList from "../components/chat/MessageList";
import UserInfo from "../components/chat/UserInfo";
import LogoutButton from "../components/LogoutButton";
import UserList from "@/components/user/UserList";

const Chat = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto w-full h-screen">
      <div className="rounded-lg w-full h-full flex flex-col">
        {/* Zone haute (messages + user list) */}
        <div className="flex h-5/6">
          {/* Zone messages */}
          <div className="relative flex-1">
            <div className="backdrop-blur-sm bg-white/50 h-1/6 absolute top-0 right-3 w-full"></div>
            <div className="overflow-y-scroll h-full pr-4">
              <MessageList />
            </div>
          </div>

          {/* Zone user list */}
          <div className="w-64 border-l border-gray-200 p-4 bg-white shadow-inner overflow-y-auto">
            <UserList />
          </div>
        </div>

        {/* Zone bas (input + infos) */}
        <div className="h-1/6 flex justify-center items-center">
          <div className="w-full gap-4 flex flex-col px-4">
            {user && (
              <div>
                <MessageForm />
              </div>
            )}
            <div className="flex justify-between">
              <UserInfo />
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
