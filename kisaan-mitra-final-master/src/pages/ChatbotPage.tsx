import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Loader2, MapPin, Globe, AlertCircle, Mic, MicOff } from "lucide-react";
import { chatbotApi, ChatbotApiError } from "@/services/chatbotApi";

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Location {
  latitude: number;
  longitude: number;
  name?: string;
}

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English", flag: "🇺🇸", speechCode: "en-US" },
  { value: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳", speechCode: "hi-IN" },
  { value: "bn", label: "বাংলা (Bengali)", flag: "🇧🇩", speechCode: "bn-BD" },
  { value: "te", label: "తెలుగు (Telugu)", flag: "🇮🇳", speechCode: "te-IN" },
  { value: "ta", label: "தமிழ் (Tamil)", flag: "🇮🇳", speechCode: "ta-IN" },
  { value: "mr", label: "मराठी (Marathi)", flag: "🇮🇳", speechCode: "mr-IN" },
  { value: "gu", label: "ગુજરાતી (Gujarati)", flag: "🇮🇳", speechCode: "gu-IN" },
];

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<Location>({
    latitude: 28.6139,
    longitude: 77.2090,
    name: "Delhi"
  });
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [apiStatus, setApiStatus] = useState<"unknown" | "online" | "offline">("unknown");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Multilingual messages for speech recognition
  const getMultilingualMessages = () => {
    const messages = {
      en: {
        listening: "Listening... Speak now",
        clickToSpeak: "Click to speak",
        stopListening: "Stop listening",
        voiceEnabled: "Voice enabled",
        noSpeech: "No speech detected. Please try again.",
        noMicrophone: "No microphone found. Please check your microphone.",
        permissionDenied: "Microphone permission denied. Please allow microphone access.",
        speechError: "Speech recognition error. Please try again.",
        placeholder: "Ask about crops, soil, weather, or farming techniques...",
        voiceInstructions: "You can also use the microphone button to speak your questions.",
        pressEnter: "Press Enter to send",
        listeningStatus: "🎤 Listening...",
        voiceEnabledStatus: "Voice enabled",
        apiOnline: "API Online",
        apiOffline: "API Offline",
        checkingApi: "Checking API..."
      },
      hi: {
        listening: "सुन रहा हूं... अब बोलिए",
        clickToSpeak: "बोलने के लिए क्लिक करें",
        stopListening: "सुनना बंद करें",
        voiceEnabled: "आवाज़ सक्षम",
        noSpeech: "कोई आवाज़ नहीं मिली। कृपया फिर से प्रयास करें।",
        noMicrophone: "माइक्रोफ़ोन नहीं मिला। कृपया अपना माइक्रोफ़ोन जांचें।",
        permissionDenied: "माइक्रोफ़ोन की अनुमति नहीं दी गई। कृपया माइक्रोफ़ोन की पहुंच दें।",
        speechError: "आवाज़ पहचान त्रुटि। कृपया फिर से प्रयास करें।",
        placeholder: "फसल, मिट्टी, मौसम या कृषि तकनीकों के बारे में पूछें...",
        voiceInstructions: "आप अपने सवाल बोलने के लिए माइक्रोफ़ोन बटन का भी उपयोग कर सकते हैं।",
        pressEnter: "भेजने के लिए एंटर दबाएं",
        listeningStatus: "🎤 सुन रहा है...",
        voiceEnabledStatus: "आवाज़ सक्षम",
        apiOnline: "एपीआई ऑनलाइन",
        apiOffline: "एपीआई ऑफलाइन",
        checkingApi: "एपीआई जांच रहा है..."
      },
      bn: {
        listening: "শুনছি... এখন বলুন",
        clickToSpeak: "বলার জন্য ক্লিক করুন",
        stopListening: "শোনা বন্ধ করুন",
        voiceEnabled: "কণ্ঠস্বর সক্ষম",
        noSpeech: "কোনো কথা শনাক্ত হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
        noMicrophone: "মাইক্রোফোন পাওয়া যায়নি। অনুগ্রহ করে আপনার মাইক্রোফোন পরীক্ষা করুন।",
        permissionDenied: "মাইক্রোফোনের অনুমতি নেই। অনুগ্রহ করে মাইক্রোফোন অ্যাক্সেস দিন।",
        speechError: "কথা চেনার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।",
        placeholder: "ফসল, মাটি, আবহাওয়া বা কৃষি কৌশল সম্পর্কে জিজ্ঞাসা করুন...",
        voiceInstructions: "আপনি আপনার প্রশ্ন বলার জন্য মাইক্রোফোন বোতামও ব্যবহার করতে পারেন।",
        pressEnter: "পাঠাতে এন্টার টিপুন",
        listeningStatus: "🎤 শুনছি...",
        voiceEnabledStatus: "কণ্ঠস্বর সক্ষম",
        apiOnline: "এপিআই অনলাইন",
        apiOffline: "এপিআই অফলাইন",
        checkingApi: "এপিআই পরীক্ষা করা হচ্ছে..."
      },
      te: {
        listening: "వింటున్నాను... ఇప్పుడు మాట్లాడండి",
        clickToSpeak: "మాట్లాడడానికి క్లిక్ చేయండి",
        stopListening: "వినడం ఆపు",
        voiceEnabled: "వాయిస్ ప్రారంభించబడింది",
        noSpeech: "మాట గుర్తించబడలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
        noMicrophone: "మైక్రోఫోన్ కనుగొనబడలేదు. దయచేసి మీ మైక్రోఫోన్‌ని తనిఖీ చేయండి.",
        permissionDenied: "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి మైక్రోఫోన్ యాక్సెస్ అనుమతించండి.",
        speechError: "మాట గుర్తింపు లోపం. దయచేసి మళ్లీ ప్రయత్నించండి.",
        placeholder: "పంటలు, మట్టి, వాతావరణం లేదా వ్యవసాయ సాంకేతికతల గురించి అడగండి...",
        voiceInstructions: "మీరు మీ ప్రశ్నలను చెప్పడానికి మైక్రోఫోన్ బటన్‌ను కూడా ఉపయోగించవచ్చు.",
        pressEnter: "అయిష్టానికి ఎంటర్ దబాండి",
        listeningStatus: "🎤 వింటున్నాను...",
        voiceEnabledStatus: "వాయిస్ ప్రారంభించబడింది",
        apiOnline: "ఐపీఆయి ఆన్‌లైన్",
        apiOffline: "ఐపీఆయి ఆఫ్‌లైన్",
        checkingApi: "ఐపీఆయి తనిఖీ చేస్తున్నాము..."
      },
      ta: {
        listening: "கேட்கிறேன்... இப்போது பேசுங்கள்",
        clickToSpeak: "பேச கிளிக் செய்யவும்",
        stopListening: "கேட்பதை நிறுத்து",
        voiceEnabled: "குரல் செயல்படுத்தப்பட்டது",
        noSpeech: "பேச்சு கண்டறியப்படவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
        noMicrophone: "மைக்ரோஃபோன் கிடைக்கவில்லை. உங்கள் மைக்ரோஃபோனைச் சரிபார்க்கவும்.",
        permissionDenied: "மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. மைக்ரோஃபோன் அணுகலை அனுமதிக்கவும்.",
        speechError: "பேச்சு அங்கீகார பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
        placeholder: "பயிர்கள், மண், வானிலை அல்லது வேளாண் நுட்பங்களைப் பற்றி கேளுங்கள்...",
        voiceInstructions: "உங்கள் கேள்விகளைச் சொல்ல மைக்ரோஃபோன் பொத்தானையும் பயன்படுத்தலாம்.",
        pressEnter: "அனுப்ப என்டர் அழுத்தவும்",
        listeningStatus: "🎤 கேட்கிறேன்...",
        voiceEnabledStatus: "குரல் செயல்படுத்தப்பட்டது",
        apiOnline: "ஏபிஆயி ஆன்லைன்",
        apiOffline: "ஏபிஆயி ஆப்லைன்",
        checkingApi: "ஏபிஆயி சரிபார்க்கிறது..."
      },
      mr: {
        listening: "ऐकत आहे... आता बोला",
        clickToSpeak: "बोलण्यासाठी क्लिक करा",
        stopListening: "ऐकणे थांबवा",
        voiceEnabled: "आवाज सक्षम",
        noSpeech: "कोणतेही भाषण आढळले नाही. कृपया पुन्हा प्रयत्न करा.",
        noMicrophone: "मायक्रोफोन सापडला नाही. कृपया तुमचा मायक्रोफोन तपासा.",
        permissionDenied: "मायक्रोफोन परवानगी नाकारली. कृपया मायक्रोफोन प्रवेशास परवानगी द्या.",
        speechError: "भाषण ओळख त्रुटी. कृपया पुन्हा प्रयत्न करा.",
        placeholder: "पिके, माती, हवामान किंवा शेती तंत्रांबद्दल विचारा...",
        voiceInstructions: "तुम्ही तुमचे प्रश्न बोलण्यासाठी मायक्रोफोन बटन देखील वापरू शकता.",
        pressEnter: "पाठवण्यासाठी एन्टर दाबा",
        listeningStatus: "🎤 ऐकत आहे...",
        voiceEnabledStatus: "आवाज सक्षम",
        apiOnline: "आयेपीआय ऑनलाईन",
        apiOffline: "आयेपीआय ऑफलाईन",
        checkingApi: "आयेपीआय तपासत आहे..."
      },
      gu: {
        listening: "સાંભળી રહ્યો છું... હવે બોલો",
        clickToSpeak: "બોલવા માટે ક્લિક કરો",
        stopListening: "સાંભળવાનું બંધ કરો",
        voiceEnabled: "અવાજ સક્ષમ",
        noSpeech: "કોઈ વાણી મળી નથી. કૃપા કરીને ફરી પ્રયાસ કરો.",
        noMicrophone: "માઇક્રોફોન મળ્યો નથી. કૃપા કરીને તમારા માઇક્રોફોનને તપાસો.",
        permissionDenied: "માઇક્રોફોન પરમિશન નકારવામાં આવી. કૃપા કરીને માઇક્રોફોન એક્સેસ આપો.",
        speechError: "વાણી ઓળખાણ ભૂલ. કૃપા કરીને ફરી પ્રયાસ કરો.",
        placeholder: "પાક, માટી, હવામાન અથવા કૃષિ તકનીકો વિશે પૂછો...",
        voiceInstructions: "તમે તમારા પ્રશ્નો બોલવા માટે માઇક્રોફોન બટનનો પણ ઉપયોગ કરી શકો છો.",
        pressEnter: "મોકલવા માટે એન્ટર દબાવો",
        listeningStatus: "🎤 સાંભળી રહ્યો છું...",
        voiceEnabledStatus: "અવાજ સક્ષમ",
        apiOnline: "એપીઆઇ ઓનલાઇન",
        apiOffline: "એપીઆઇ ઓફલાઇન",
        checkingApi: "એપીઆઇ તપાસી રહ્યો છે..."
      }
    };
    return messages[selectedLanguage as keyof typeof messages] || messages.en;
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Initialize speech recognition and get user's location on component mount
  useEffect(() => {
    getCurrentLocation();
    initializeSpeechRecognition();
  }, []);

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      
      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        
        // Configure speech recognition
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 1;
        
        // Set language based on selected language
        const languageMap: Record<string, string> = {
          en: 'en-US',
          hi: 'hi-IN',
          bn: 'bn-BD',
          te: 'te-IN',
          ta: 'ta-IN',
          mr: 'mr-IN',
          gu: 'gu-IN'
        };
        recognitionRef.current.lang = languageMap[selectedLanguage] || 'en-US';
        
        // Speech recognition event handlers
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          // Show user-friendly error message based on error type
          let errorMessage = "";
          switch (event.error) {
            case 'no-speech':
              errorMessage = "No speech detected. Please try again.";
              break;
            case 'audio-capture':
              errorMessage = "No microphone found. Please check your microphone.";
              break;
            case 'not-allowed':
              errorMessage = "Microphone permission denied. Please allow microphone access.";
              break;
            default:
              errorMessage = "Speech recognition error. Please try again.";
          }
          
          // You could show this error in a toast or alert if you have a notification system
          console.warn(errorMessage);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        setSpeechSupported(false);
      }
    }
  };

  // Update speech recognition language when selected language changes
  useEffect(() => {
    if (recognitionRef.current && speechSupported) {
      const languageMap: Record<string, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        bn: 'bn-BD',
        te: 'te-IN',
        ta: 'ta-IN',
        mr: 'mr-IN',
        gu: 'gu-IN'
      };
      recognitionRef.current.lang = languageMap[selectedLanguage] || 'en-US';
    }
  }, [selectedLanguage, speechSupported]);

  // Start/stop speech recognition
  const toggleSpeechRecognition = () => {
    if (!speechSupported || !recognitionRef.current) {
      console.warn('Speech recognition not supported');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInputMessage(''); // Clear input before starting
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: Number(position.coords.latitude.toFixed(4)),
          longitude: Number(position.coords.longitude.toFixed(4)),
          name: "Current Location"
        });
        setLocationStatus("success");
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationStatus("error");
        // Keep default Delhi location
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const data = await chatbotApi.sendMessage({
        message: inputMessage,
        languageCode: selectedLanguage,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      // Update API status to online since the request succeeded
      if (apiStatus !== "online") {
        setApiStatus("online");
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || data.message || "Sorry, I couldn't process your request.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Update API status if it's a connection error
      if (error instanceof ChatbotApiError && !error.status) {
        setApiStatus("offline");
      }
      
      let errorContent = "I am sorry, I am having trouble connecting right now. Please try again in a moment.";
      
      if (error instanceof ChatbotApiError) {
        // Check for specific error types
        if (error.message.includes('quota') || error.message.includes('429')) {
          errorContent = "I'm currently at my daily limit. Please try again later or contact support for more assistance.";
        } else if (error.message.includes('timeout')) {
          errorContent = "The request is taking too long. Please check your connection and try again.";
        } else if (error.message.includes('Cannot connect')) {
          errorContent = "Cannot connect to the server. Please make sure you're connected to the internet.";
        } else if (error.status === 500) {
          errorContent = "The server encountered an error. Please try again in a moment.";
        } else {
          errorContent = error.message;
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground">Chat with our agricultural AI assistant for farming insights and recommendations</p>
        </div>
      </div>

      <Card className="flex flex-col h-[600px]">
        <CardHeader className="flex-shrink-0">
          <div className="flex flex-col space-y-4">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Agricultural AI Chat
            </CardTitle>
            
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Language Selection */}
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <span>{option.flag}</span>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Status */}
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Location:</span>
                  {locationStatus === "loading" ? (
                    <Badge variant="secondary" className="text-xs">
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      Getting location...
                    </Badge>
                  ) : locationStatus === "success" ? (
                    <Badge variant="default" className="text-xs">
                      {location.name} ({location.latitude}, {location.longitude})
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Delhi (default)
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={locationStatus === "loading"}
                    className="h-6 px-2 text-xs"
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          {/* Chat Messages Area */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {/* Welcome Message */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="bg-muted/50 rounded-lg p-3 border">
                    <p className="text-sm">
                      Hello! I'm your agricultural AI assistant. I can help you with:
                    </p>
                    <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                      <li>• Crop recommendations based on your conditions</li>
                      <li>• Weather-based farming advice</li>
                      <li>• Soil health analysis and improvements</li>
                      <li>• Pest and disease management</li>
                      <li>• Irrigation and water management tips</li>
                    </ul>
                    <p className="text-sm mt-2">
                      Feel free to ask me anything about your farming needs! {speechSupported && getMultilingualMessages().voiceInstructions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              {messages.map((message) => (
                <div key={message.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    {message.role === "user" ? (
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-accent" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div 
                      className={`rounded-lg p-3 border ${
                        message.role === "user" 
                          ? "bg-accent/10 border-accent/20 ml-8" 
                          : "bg-muted/50 border-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-muted/50 rounded-lg p-3 border">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm text-muted-foreground">AI is thinking...</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Chat Input Area */}
          <div className="flex-shrink-0 border-t bg-background p-4">
            <div className="flex gap-2 mb-2">
              <Input 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? getMultilingualMessages().listening : getMultilingualMessages().placeholder}
                className="flex-1 bg-background"
                disabled={isLoading || isListening}
              />
              {/* Speech-to-Text Button */}
              {speechSupported && (
                <Button
                  onClick={toggleSpeechRecognition}
                  size="icon"
                  variant={isListening ? "default" : "outline"}
                  disabled={isLoading}
                  className={`${isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : ""}`}
                  title={isListening ? getMultilingualMessages().stopListening : getMultilingualMessages().clickToSpeak}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button 
                onClick={sendMessage}
                size="icon" 
                disabled={isLoading || !inputMessage.trim() || isListening}
                className={isLoading ? "bg-muted" : ""}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>{isListening ? getMultilingualMessages().listeningStatus : getMultilingualMessages().pressEnter}</span>
                <div className="flex items-center gap-1">
                  {apiStatus === "online" ? (
                    <><div className="w-2 h-2 bg-green-500 rounded-full"></div><span>{getMultilingualMessages().apiOnline}</span></>
                  ) : apiStatus === "offline" ? (
                    <><AlertCircle className="w-3 h-3 text-red-500" /><span>{getMultilingualMessages().apiOffline}</span></>
                  ) : (
                    <><div className="w-2 h-2 bg-yellow-500 rounded-full"></div><span>{getMultilingualMessages().checkingApi}</span></>
                  )}
                </div>
                {speechSupported && (
                  <div className="flex items-center gap-1">
                    <Mic className="w-3 h-3 text-green-600" />
                    <span>{getMultilingualMessages().voiceEnabledStatus}</span>
                  </div>
                )}
              </div>
              <span>Language: {LANGUAGE_OPTIONS.find(lang => lang.value === selectedLanguage)?.label}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotPage;