import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/auth';
import { ChevronLeft, ChevronRight, Bell, CheckCircle, Mail, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Motion } from '@legendapp/motion';
import { Gradients, Typography, Colors } from '../constants/Colors';
import * as Haptics from 'expo-haptics';

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, signInWithApple } = useAuth();

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [email, setEmail] = useState('');

  const steps = [
    {
      title: "🎯 Welcome to Your Decision Journey",
      description: "Ready to transform your digital life with smart micro-decisions?",
      personality: "Let's make some magic happen! ✨"
    },
    {
      title: "What's Your Decision Style?",
      description: "Pick your vibe - we'll tailor suggestions just for you!",
      type: "quiz",
      question: "How do you usually feel about making decisions?",
      options: [
        { emoji: "⚡", text: "Quick & Decisive", description: "I know what I want fast!" },
        { emoji: "🤔", text: "Thoughtful Explorer", description: "I like to consider options" },
        { emoji: "🎯", text: "Goal-Oriented", description: "I focus on what matters most" },
        { emoji: "🎲", text: "Fun & Spontaneous", description: "I enjoy the surprise factor" }
      ]
    },
    {
      title: "What Areas Need Your Attention?",
      description: "Choose the digital clutter you'd like help organizing",
      type: "interests",
      options: [
        { emoji: "📧", text: "Email Overload", description: "Unsubscribe from newsletters" },
        { emoji: "🖼️", text: "Photo Chaos", description: "Find & delete duplicates" },
        { emoji: "💪", text: "Quick Fitness", description: "5-min workout routines" },
        { emoji: "🗂️", text: "File Organization", description: "Clean up digital files" }
      ]
    },
    {
      title: "🎉 You're All Set!",
      description: "Your personalized decision journey begins now!",
      type: "celebration",
      personality: "Time for your first win! Let's celebrate! 🎊"
    }
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and navigate to home
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        router.replace('/');
      }, 2000);
    }
  };

  const handleBack = async () => {
    if (currentStep > 0) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep(currentStep - 1);
    }
  };

  const selectInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleQuizAnswer = async (answer: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Store the answer (in a real app, you'd save this to user preferences)
    console.log('Selected decision style:', answer);
    handleNext();
  };

  const handleSignInGoogle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await signInWithGoogle();
    handleNext();
  };

  const handleSignInApple = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await signInWithApple();
    handleNext();
  };

  const handleSignInEmail = async () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signInWithEmail(trimmed);
    handleNext();
  };

  const renderStep = () => {
    const step = steps[currentStep];

    switch(step.type) {
      case "quiz":
        return (
          <Motion.View
            className="flex-1 px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'timing', delay: 0.2, duration: 250 }}
          >
            <Text
              className="text-3xl font-bold text-center text-white mb-3"
              style={Typography.hero}
            >
              {step.title}
            </Text>
            <Text className="text-white/80 text-center text-lg mb-8">
              {step.description}
            </Text>

            <Text className="text-white font-semibold text-xl mb-6 text-center">
              {step.question}
            </Text>

            <View className="gap-4">
              {step.options?.map((option, index) => (
                <Motion.View
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'timing', delay: 0.3 + (index * 0.1), duration: 250 }}
                >
                  <TouchableOpacity
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                    onPress={() => handleQuizAnswer(option.text)}
                  >
                    <View className="flex-row items-center">
                      <Text className="text-4xl mr-4">{option.emoji}</Text>
                      <View className="flex-1">
                        <Text className="text-white font-bold text-lg mb-1">
                          {option.text}
                        </Text>
                        <Text className="text-white/70 text-sm">
                          {option.description}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Motion.View>
              ))}
            </View>
          </Motion.View>
        );

      case "interests":
        return (
          <Motion.View
            className="flex-1 px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'timing', delay: 0.2, duration: 250 }}
          >
            <Text
              className="text-3xl font-bold text-center text-white mb-3"
              style={Typography.hero}
            >
              {step.title}
            </Text>
            <Text className="text-white/80 text-center text-lg mb-8">
              {step.description}
            </Text>

            <View className="gap-4">
              {step.options?.map((option, index) => (
                <Motion.View
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'timing', delay: 0.3 + (index * 0.1), duration: 250 }}
                >
                  <TouchableOpacity
                    className={`rounded-2xl p-6 border-2 ${
                      selectedInterests.includes(option.text)
                        ? 'bg-white/20 border-yellow-400'
                        : 'bg-white/10 border-white/20'
                    }`}
                    onPress={() => selectInterest(option.text)}
                  >
                    <View className="flex-row items-center">
                      <Text className="text-4xl mr-4">{option.emoji}</Text>
                      <View className="flex-1">
                        <Text className={`font-bold text-lg mb-1 ${
                          selectedInterests.includes(option.text)
                            ? 'text-yellow-300'
                            : 'text-white'
                        }`}>
                          {option.text}
                        </Text>
                        <Text className="text-white/70 text-sm">
                          {option.description}
                        </Text>
                      </View>
                      {selectedInterests.includes(option.text) && (
                        <Text className="text-yellow-400 text-2xl">✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </Motion.View>
              ))}
            </View>
          </Motion.View>
        );

      case "celebration":
        return (
          <Motion.View
            className="flex-1 items-center justify-center px-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', delay: 0.2, duration: 250 }}
          >
            <Text className="text-6xl mb-6">🎉</Text>
            <Text
              className="text-3xl font-bold text-center text-white mb-3"
              style={Typography.hero}
            >
              {step.title}
            </Text>
            <Text className="text-white/80 text-center text-lg mb-6">
              {step.description}
            </Text>
            <Text className="text-yellow-300 text-center text-xl font-medium mb-8">
              {step.personality}
            </Text>

            <TouchableOpacity
              className="bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 rounded-2xl"
              onPress={handleNext}
            >
              <Text className="text-white font-bold text-xl">
                Let's Start! 🚀
              </Text>
            </TouchableOpacity>
          </Motion.View>
        );

      default: // Welcome
        return (
          <Motion.View
            className="flex-1 items-center justify-center px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'timing', delay: 0.2, duration: 250 }}
          >
            <View className="bg-white/20 backdrop-blur-md p-8 rounded-full mb-8 border border-white/30">
              <Text className="text-6xl">🎯</Text>
            </View>
            <Text
              className="text-4xl font-bold text-center text-white mb-4"
              style={Typography.hero}
            >
              {step.title.replace('🎯 ', '')}
            </Text>
            <Text className="text-white/80 text-center text-lg mb-6">
              {step.description}
            </Text>
            <Text className="text-yellow-300 text-center text-xl font-medium">
              {step.personality}
            </Text>

            {/* Sign up options */}
            <View className="w-full mt-8 gap-3">
              <TouchableOpacity
                className="bg-white rounded-xl py-3 items-center border border-white/30"
                onPress={handleSignInGoogle}
              >
                <Text className="text-indigo-700 font-bold">Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-white rounded-xl py-3 items-center border border-white/30"
                onPress={handleSignInApple}
              >
                <Text className="text-indigo-700 font-bold">Continue with Apple</Text>
              </TouchableOpacity>

              <View className="flex-row items-center my-2">
                <View className="flex-1 h-px bg-white/30" />
                <Text className="mx-3 text-white/70">or</Text>
                <View className="flex-1 h-px bg-white/30" />
              </View>

              <View className="bg-white/10 border border-white/20 rounded-xl px-4 py-2">
                <TextInput
                  placeholder="you@example.com"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  style={{ color: 'white' }}
                />
              </View>
              <TouchableOpacity
                className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl py-3 items-center"
                onPress={handleSignInEmail}
              >
                <View className="flex-row items-center">
                  <Text className="text-white font-bold mr-2">Continue with Email</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Motion.View>
        );
    }
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={Gradients.premium as readonly [string, string, ...string[]]}
        className="flex-1"
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        

        {/* Progress bar */}
        <Motion.View
          className="h-1 bg-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Motion.View
            className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep + 1) * 25}%` }}
            transition={{ type: 'spring', damping: 20, mass: 1, stiffness: 100 }}
          />
        </Motion.View>

        {/* Step indicator */}
        <Motion.View
          className="flex-row justify-center py-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'timing', delay: 0.1, duration: 250 }}
        >
          {steps.map((_, index) => (
            <Motion.View
              key={index}
              className={`w-3 h-3 rounded-full mx-2 ${
                index === currentStep
                  ? "bg-yellow-400"
                  : index < currentStep
                    ? "bg-green-400"
                    : "bg-white/30"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'timing', delay: 0.2 + (index * 0.1), duration: 250 }}
            />
          ))}
        </Motion.View>

        {/* Step content */}
        <View className="flex-1">
          {renderStep()}
        </View>

        {/* Navigation */}
        <Motion.View
          className="flex-row justify-between px-6 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'timing', delay: 0.3, duration: 250 }}
        >
          <TouchableOpacity
            onPress={handleBack}
            disabled={currentStep === 0}
            className={`bg-white/20 backdrop-blur-md rounded-xl px-6 py-3 border border-white/30 ${
              currentStep === 0 ? "opacity-0" : ""
            }`}
          >
            <View className="flex-row items-center">
              <ChevronLeft color="white" size={20} />
              <Text className="text-white font-medium ml-2">Back</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-xl"
          >
            <View className="flex-row items-center">
              <Text className="text-white font-bold mr-2">
                {currentStep === steps.length - 1 ? "Let's Go!" : "Next"}
              </Text>
              {currentStep !== steps.length - 1 && (
                <ChevronRight color="white" size={20} />
              )}
            </View>
          </TouchableOpacity>
        </Motion.View>
      </LinearGradient>
    </View>
  );
};

export default OnboardingScreen;