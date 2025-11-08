import React, { useContext, useState, useEffect, useRef } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

const DoctorMessages = () => {
  const {
    chatHistory,
    getChatHistory,
    getUserMessages,
    sendMessage,
    loading,
  } = useContext(DoctorContext);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getChatHistory();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleConversationClick = async (conversation) => {
    setSelectedConversation(conversation);
    setIsLoadingMessages(true);
    const result = await getUserMessages(conversation.userId);
    if (result.success) {
      setMessages(result.messages || []);
      setSelectedUser(result.user);
    } else {
      toast.error(result.message || "Failed to load messages");
    }
    setIsLoadingMessages(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation?.userId) return;

    const messageText = newMessage.trim();
    setNewMessage("");

    try {
      const result = await sendMessage(selectedConversation.userId, messageText);
      if (result.success) {
        // Reload messages to get the latest from server
        await handleConversationClick(selectedConversation);
        // Refresh chat history
        await getChatHistory();
      } else {
        toast.error(result.message || "Failed to send message");
        setNewMessage(messageText); // Restore message if failed
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setNewMessage(messageText); // Restore message if failed
    }
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  // Filter conversations based on search
  const filteredConversations = chatHistory.filter((conv) =>
    conv.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium text-white">Messages</p>
      <div className="bg-[#2a2a2a] border border-gray-700 rounded">
        <div className="flex h-[80vh]">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <div
                    className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-[#333333] transition-colors ${
                      selectedConversation?.userId === conv.userId ? "bg-[#333333]" : ""
                    }`}
                    key={conv.userId}
                    onClick={() => handleConversationClick(conv)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={conv.avatar}
                        alt={conv.user}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{conv.user}</h3>
                        <p className="text-gray-400 text-sm truncate">{conv.lastMessage}</p>
                        <p className="text-gray-500 text-xs mt-1">{formatTimeAgo(conv.lastMessageTime)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <p>No conversations found</p>
                  {chatHistory.length === 0 && (
                    <p className="text-sm mt-2">Start chatting with users to see messages here</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation && selectedUser ? (
              <>
                <div className="p-4 border-b border-gray-700 bg-[#333333]">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedUser.image || selectedConversation.avatar}
                      alt={selectedUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-white font-medium">{selectedUser.name}</h3>
                      <p className="text-gray-400 text-sm">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoadingMessages ? (
                    <div className="text-center text-gray-400 py-8">
                      <p>Loading messages...</p>
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg, index) => (
                      <div
                        key={msg._id || index}
                        className={`flex ${
                          msg.sender === "doctor" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender === "doctor"
                              ? "bg-primary text-white"
                              : "bg-[#333333] text-gray-200"
                          }`}
                        >
                          <p>{msg.message}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-[#1a1a1a] border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || !newMessage.trim()}
                  >
                    {loading ? "Sending..." : "Send"}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h2 className="text-xl font-medium mb-2">Select a conversation</h2>
                  <p>Choose a conversation from the list to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorMessages;

