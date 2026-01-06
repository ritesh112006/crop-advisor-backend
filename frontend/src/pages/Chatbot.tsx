import DashboardLayout from "@/components/layout/DashboardLayout";
import { MessageCircle, Send, Bot, User, Leaf, Mic, MicOff, Volume2, Image, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCrop } from "@/contexts/CropContext";

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
  time: string;
  image?: string;
}

const Chatbot = () => {
  const { language, t } = useLanguage();
  const { selectedCrop, sensorData } = useCrop();
  
  const getInitialMessage = (): Message => ({
    id: 1,
    type: "bot",
    content: selectedCrop 
      ? `Namaste! I see you're growing **${selectedCrop.name}** ${selectedCrop.imageEmoji}. I can help you with:\n\n• Watering schedules for ${selectedCrop.name}\n• Fertilizer recommendations\n• Pest and disease management\n• Weather-based advice\n• Real-time sensor data analysis\n\nYou can also **upload an image** of your crop and I'll analyze it for any issues!`
      : "Namaste! I'm your Crop Advisor AI assistant, powered by Gemini AI. I can help you with:\n\n• Crop recommendations based on your soil\n• Irrigation and watering schedules\n• Fertilizer suggestions based on NPK levels\n• Weather-based farming advice\n• Real-time sensor data analysis\n\nUpload crop images for AI analysis!",
    time: "Just now",
  });

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languageOptions = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "mr", name: "मराठी" },
    { code: "ta", name: "தமிழ்" },
    { code: "te", name: "తెలుగు" },
    { code: "kn", name: "ಕನ್ನಡ" },
    { code: "ml", name: "മലയാളം" },
  ];

  const quickQuestions = selectedCrop 
    ? [`Best practices for ${selectedCrop.name}?`, "When should I irrigate?", "Fertilizer schedule?", "Pest control tips?"]
    : ["Which crop is best for my soil?", "When should I irrigate?", "Weather forecast?", "Fertilizer recommendation"];

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  
  // Load chat history on component mount
  useEffect(() => { 
    const loadChatHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("/api/chat/history?limit=50", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            // Convert database messages to Message format
            const loadedMessages = data.messages.map((msg: any, index: number) => ({
              id: index + 2,
              type: msg.type,
              content: msg.content,
              time: new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            setMessages([getInitialMessage(), ...loadedMessages]);
          }
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };

    loadChatHistory();
  }, []);
  
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() && !selectedImage) return;
    
    const userMessage: Message = { 
      id: messages.length + 1, 
      type: "user", 
      content: content.trim() || "Analyze this image", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: selectedImage || undefined 
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    const hadImage = !!selectedImage;
    setSelectedImage(null);
    setIsTyping(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("User not authenticated. Please login first.");
      }

      // Call the backend API with the user's query
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: content.trim() || "Analyze this crop image",
          image: hadImage ? selectedImage : undefined,
          language: selectedLanguage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.response || "I apologize, but I couldn't generate a response. Please try again.";

      const botMessage: Message = { 
        id: messages.length + 2, 
        type: "bot", 
        content: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMessage]);
      
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: messages.length + 2,
        type: "bot",
        content: `I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again or contact support.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-semibold text-foreground">{t("cropAdvisorAI")}</h1>
                {selectedCrop && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 bg-leaf rounded-full animate-pulse" />
                    <span className="text-primary">{selectedCrop.imageEmoji} {selectedCrop.name}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground">Language:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-card rounded-2xl shadow-md flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex gap-3 animate-slide-up", message.type === "user" && "flex-row-reverse")}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", message.type === "bot" ? "bg-primary" : "bg-accent")}>
                  {message.type === "bot" ? <Bot className="w-5 h-5 text-primary-foreground" /> : <User className="w-5 h-5 text-accent-foreground" />}
                </div>
                <div className={cn("max-w-[80%] p-4 rounded-2xl", message.type === "bot" ? "bg-muted rounded-tl-none" : "bg-primary text-primary-foreground rounded-tr-none")}>
                  {message.image && <img src={message.image} alt="Uploaded" className="max-w-full h-auto rounded-lg mb-2 max-h-48 object-cover" />}
                  <div className="text-sm whitespace-pre-line leading-relaxed">
                    {message.content.split('\n').map((line, i) => (
                      <div key={i}>
                        {line.split(/(\*\*.*?\*\*)/).map((part, j) => 
                          part.startsWith('**') && part.endsWith('**')
                            ? <strong key={j}>{part.slice(2, -2)}</strong>
                            : part
                        )}
                      </div>
                    ))}
                  </div>
                  <div className={cn("flex items-center gap-2 mt-2", message.type === "bot" ? "text-muted-foreground" : "text-primary-foreground/70")}>
                    <span className="text-xs">{message.time}</span>
                    {message.type === "bot" && <button className="p-1 hover:bg-muted-foreground/10 rounded transition-colors"><Volume2 className="w-3 h-3" /></button>}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><Bot className="w-5 h-5 text-primary-foreground" /></div>
                <div className="bg-muted p-4 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {selectedImage && (
            <div className="px-4 py-2 border-t border-border bg-muted/30">
              <div className="relative inline-block">
                <img src={selectedImage} alt="Preview" className="h-20 rounded-lg object-cover" />
                <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          <div className="px-4 py-3 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2">{t("quickQuestions")}:</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickQuestions.map((question) => (
                <button key={question} onClick={() => sendMessage(question)} className="px-3 py-2 bg-card text-foreground rounded-lg text-sm whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors border border-border">
                  {question}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-4 border-t border-border">
            <div className="flex gap-3">
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 rounded-xl bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" title={t("uploadImage")}>
                <Image className="w-5 h-5" />
              </button>
              <button type="button" onClick={() => setIsListening(!isListening)} className={cn("p-3 rounded-xl transition-colors", isListening ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("askAnything")} className="flex-1 px-4 py-3 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base" />
              <Button type="submit" disabled={(!input.trim() && !selectedImage) || isTyping} className="px-4"><Send className="w-5 h-5" /></Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chatbot;
