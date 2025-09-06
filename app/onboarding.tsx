import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/auth';
import { ChevronLeft, ChevronRight, Bell, CheckCircle, Mail, Shield } from 'lucide-react-native';

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { signInWithEmail } = useAuth();

  const steps = [
    {
      title: "Welcome to MicroDecide",
      description: "Simplify your daily choices with intelligent suggestions for email unsubscribes, photo duplicates, and quick workouts.",
      image: "https://images.unsplash.com/photo-1480694313141-fce5e697ee25?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      title: "Sign In Options",
      description: "Choose how you'd like to get started with MicroDecide. You can always change this later.",
      options: [
        { icon: Mail, text: "Continue with Email", color: "bg-blue-500" },
        { icon: Shield, text: "Continue with Apple", color: "bg-gray-800" },
      ]
    },
    {
      title: "Select Your Interests",
      description: "Choose the areas you'd like help with. You can always adjust these settings later.",
      categories: [
        { name: "Email Management", icon: "✉️", selected: true },
        { name: "Photo Organization", icon: "📸", selected: false },
        { name: "Fitness", icon: "💪", selected: true },
        { name: "Finance", icon: "💰", selected: false },
        { name: "Shopping", icon: "🛒", selected: false },
        { name: "Travel", icon: "✈️", selected: true },
      ]
    },
    {
      title: "Stay Notified",
      description: "Enable notifications to receive timely suggestions and reminders.",
      image: "https://images.unsplash.com/photo-1557425529-b1ae9c141e7d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmVjcnVpdG1lbnR8ZW58MHx8MHx8fDA%3D",
      icon: Bell
    },
    {
      title: "You're All Set!",
      description: "Start making smarter decisions one step at a time. Your first suggestion is waiting for you.",
      icon: CheckCircle
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleCategory = (index: number) => {
    // In a real app, you would update the state here
    console.log(`Toggled category at index ${index}`);
  };

  const renderStep = () => {
    const step = steps[currentStep];
    
    switch(currentStep) {
      case 0: // Welcome
        return (
          <View className="flex-1 items-center justify-center p-6">
            <Image 
              source={{ uri: step.image }} 
              className="w-64 h-64 rounded-2xl mb-8" 
              resizeMode="cover"
            />
            <Text className="text-3xl font-bold text-center text-gray-800 mb-4">{step.title}</Text>
            <Text className="text-gray-600 text-center text-base">{step.description}</Text>
          </View>
        );
      
      case 1: // Sign In Options
        return (
          <View className="flex-1 p-6">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-4">{step.title}</Text>
            <Text className="text-gray-600 text-center mb-10">{step.description}</Text>
            
            <View className="space-y-4">
              {(step.options ?? []).map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <TouchableOpacity 
                    key={index}
                    className={`${option.color} p-4 rounded-xl flex-row items-center justify-center`}
                    onPress={async () => {
                      // Stub auth: use email-based sign-in for all buttons
                      const email = option.text.includes('Email')
                        ? 'tester@example.com'
                        : option.text.includes('Apple')
                          ? 'apple-user@local'
                          : 'google-user@local';
                      await signInWithEmail(email);
                      router.replace('/');
                    }}
                  >
                    <IconComponent color="white" size={20} />
                    <Text className="text-white font-medium ml-3">{option.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      
      case 2: // Category Selection
        return (
          <View className="flex-1 p-6">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-4">{step.title}</Text>
            <Text className="text-gray-600 text-center mb-8">{step.description}</Text>
            
            <View className="flex-row flex-wrap gap-4">
              {(step.categories ?? []).map((category, index) => (
                <TouchableOpacity
                  key={index}
                  className={`basis-[45%] p-4 rounded-xl border-2 ${
                    category.selected 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 bg-white"
                  }`}
                  onPress={() => toggleCategory(index)}
                >
                  <Text className="text-2xl mb-2">{category.icon}</Text>
                  <Text className={`font-medium ${
                    category.selected ? "text-blue-700" : "text-gray-700"
                  }`}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      
      case 3: // Notifications
        return (
          <View className="flex-1 items-center justify-center p-6">
            <Bell size={80} color="#4A90E2" className="mb-8" />
            <Text className="text-2xl font-bold text-center text-gray-800 mb-4">{step.title}</Text>
            <Text className="text-gray-600 text-center mb-8">{step.description}</Text>
            
            <Image 
              source={{ uri: step.image }} 
              className="w-64 h-40 rounded-2xl mb-8" 
              resizeMode="cover"
            />
            
            <TouchableOpacity className="bg-blue-500 p-4 rounded-xl w-full">
              <Text className="text-white font-bold text-center">Enable Notifications</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 4: // Completion
        return (
          <View className="flex-1 items-center justify-center p-6">
            <CheckCircle size={100} color="#4A90E2" className="mb-8" />
            <Text className="text-2xl font-bold text-center text-gray-800 mb-4">{step.title}</Text>
            <Text className="text-gray-600 text-center mb-8">{step.description}</Text>
            
            <TouchableOpacity className="bg-blue-500 p-4 rounded-xl w-full mt-4">
              <Text className="text-white font-bold text-center">Get Started</Text>
            </TouchableOpacity>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Progress bar */}
      <View className="h-1 bg-gray-200">
        <View 
          className="h-1 bg-blue-500" 
          style={{ width: `${(currentStep + 1) * 20}%` }}
        />
      </View>
      
      {/* Step indicator */}
      <View className="flex-row justify-center mt-6 mb-2">
        {steps.map((_, index) => (
          <View 
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === currentStep ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
      
      {/* Step content */}
      <View className="flex-1">
        {renderStep()}
      </View>
      
      {/* Navigation */}
      <View className="flex-row justify-between p-6">
        <TouchableOpacity 
          onPress={handleBack}
          disabled={currentStep === 0}
          className={currentStep === 0 ? "opacity-0" : ""}
        >
          <View className="flex-row items-center">
            <ChevronLeft color="#4A90E2" size={24} />
            <Text className="text-blue-500 font-medium">Back</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleNext}
          disabled={currentStep === steps.length - 1}
          className={currentStep === steps.length - 1 ? "opacity-0" : ""}
        >
          <View className="flex-row items-center">
            <Text className="text-blue-500 font-medium">Next</Text>
            <ChevronRight color="#4A90E2" size={24} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;