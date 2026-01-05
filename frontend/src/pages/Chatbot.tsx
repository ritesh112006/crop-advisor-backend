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

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://crop-advisor-backend-1.onrender.com";

const Chatbot = () => {
  const { language, t } = useLanguage();
  const { selectedCrop, sensorData } = useCrop();
  
  const getInitialMessage = (): Message => ({
    id: 1,
    type: "bot",
    content: selectedCrop 
      ? `Namaste! 🌱 I see you're growing **${selectedCrop.name}** ${selectedCrop.imageEmoji}. I can help you with:\n\n• Watering schedules for ${selectedCrop.name}\n• Fertilizer recommendations\n• Pest and disease management\n• Weather-based advice\n• Custom farming questions\n\nYou can also **upload an image** of your crop and I'll analyze it for any issues!\n\nWhat would you like to know?`
      : "Namaste! 🌱 I'm your Crop Advisor AI assistant powered by Gemini. I can help you with:\n\n• Crop recommendations based on your soil\n• Irrigation and watering schedules\n• Fertilizer suggestions\n• Weather-based farming advice\n• Custom farming questions\n\n📷 **New:** Upload crop images for AI analysis!\n\nWhat can I help you with today?",
    time: "Just now",
  });

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickQuestions = selectedCrop 
    ? [`Best practices for ${selectedCrop.name}?`, "When should I irrigate?", "Fertilizer schedule?", "Pest control tips?"]
    : ["Which crop is best for my soil?", "When should I irrigate?", "Weather forecast?", "Fertilizer recommendation"];

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Get Gemini AI response from backend
  const getGeminiResponse = async (userMessage: string): Promise<string> => {
    try {
      const token = localStorage.getItem("token");
      
      // Debug logs
      console.log("=== Chatbot API Call Debug ===");
      console.log("1. Token exists:", !!token);
      console.log("2. Token value:", token ? token.substring(0, 20) + "..." : "NOT FOUND");
      console.log("3. API Base URL:", API_BASE_URL);
      console.log("4. Full URL:", `${API_BASE_URL}/ai/chat`);
      console.log("5. Message:", userMessage);
      
      if (!token) {
        const errorMsg = "Error: No authentication token found. Please log in again.";
        console.error("❌", errorMsg);
        return errorMsg;
      }

      const requestBody = { message: userMessage };
      console.log("6. Request body:", requestBody);
      
      console.log("7. Sending fetch request...");
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("8. Response received:");
      console.log("   - Status:", response.status);
      console.log("   - Status text:", response.statusText);
      console.log("   - OK:", response.ok);
      console.log("   - Content-Type:", response.headers.get("Content-Type"));
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.log("9. Error JSON:", errorData);
        } catch (e) {
          const errorText = await response.text();
          console.log("9. Error text:", errorText);
          errorData = { error: errorText };
        }

        if (response.status === 401) {
          const msg = "Error: Your session expired. Please log in again.";
          console.error("❌ Auth error:", msg);
          return msg;
        }

        if (response.status === 400) {
          const msg = `Bad request: ${errorData?.error || "Invalid message format"}`;
          console.error("❌ Bad request:", msg);
          return msg;
        }

        const msg = `Error: Server returned status ${response.status} - ${errorData?.error || response.statusText}`;
        console.error("❌", msg);
        return msg;
      }

      // Parse response
      let data;
      try {
        data = await response.json();
        console.log("10. Response JSON:", data);
      } catch (e) {
        const msg = `Error: Invalid JSON response from server: ${(e as Error).message}`;
        console.error("❌", msg);
        return msg;
      }
      
      if (!data.response) {
        const msg = `Error: Empty or invalid response from AI. Response was: ${JSON.stringify(data)}`;
        console.warn("⚠️", msg);
        return msg;
      }
      
      console.log("✅ Successfully got response:", data.response.substring(0, 100) + "...");
      return data.response;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("❌ Exception caught:");
      console.error("   - Type:", error instanceof Error ? error.constructor.name : typeof error);
      console.error("   - Message:", errorMsg);
      console.error("   - Full error:", error);
      
      // Provide more specific error messages based on common issues
      if (errorMsg.includes("Failed to fetch")) {
        return "Error: Network issue - Check if backend is running and CORS is configured correctly.";
      }
      if (errorMsg.includes("CORS")) {
        return "Error: CORS policy blocked the request. Backend CORS settings need adjustment.";
      }
      if (errorMsg.includes("401")) {
        return "Error: Authentication failed. Your token may be invalid. Please log in again.";
      }
      
      return `Error: ${errorMsg}. Please check your connection and try again.`;
    }
  };

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
      const responseText = await getGeminiResponse(content.trim() || "Analyze this crop image for any issues.");
      
      const botMessage: Message = { 
        id: messages.length + 2, 
        type: "bot", 
        content: responseText, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      const errorMessage: Message = { 
        id: messages.length + 2, 
        type: "bot", 
        content: "Sorry, I encountered an error while processing your request. Please try again.", 
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
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-leaf rounded-full animate-pulse" />
                  {t("onlineMultilingual")}
                  {selectedCrop && <span className="text-primary">• {selectedCrop.imageEmoji} {selectedCrop.name}</span>}
                </p>
              </div>
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
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
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
