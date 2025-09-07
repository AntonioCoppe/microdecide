import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../lib/auth';
import { Bell, CheckCircle, Mail, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Motion } from '@legendapp/motion';
import { Gradients, Typography, Colors } from '../constants/Colors';
import { Confetti, ConfettiPresets } from '../components/ui/confetti';
import * as Haptics from 'expo-haptics';

const OnboardingScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signInWithEmail, signInWithGoogle, signInWithApple } = useAuth();
  
  // If coming from preview, start at the final step
  const [currentStep, setCurrentStep] = useState(params.fromPreview ? 3 : 0);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [recentlySelected, setRecentlySelected] = useState<string | null>(null);
  const [showDetailedQuiz, setShowDetailedQuiz] = useState(false);
  const [selectedQuizCategory, setSelectedQuizCategory] = useState<string | null>(null);
  const [showAllInterests, setShowAllInterests] = useState(false);
  const [selectedDecisionStyle, setSelectedDecisionStyle] = useState<string | null>(null);

  const steps = [
    {
      title: "I want to make smarter choices, one decision at a time.",
      description: "My daily productivity starts here.",
      personality: "Let's make some magic happen! ✨"
    },
    {
      title: "Welcome!",
      description: "Choose how you'd like to continue",
      type: "signup",
      personality: "Let's start making your first smart choice 🎯"
    },
    {
      title: "What's Your Decision Style?",
      description: "Pick your vibe - we'll tailor suggestions just for you!",
      type: "quiz",
      question: "How do you usually feel about making decisions?",
      broadOptions: [
        { 
          emoji: "⚡", 
          text: "Quick & Decisive", 
          description: "I know what I want fast and trust my instincts",
          subtypes: [
            { emoji: "🚀", text: "Lightning Fast", description: "I decide in seconds" },
            { emoji: "🎯", text: "Confident Intuition", description: "I trust my gut feeling" }
          ]
        },
        { 
          emoji: "🤔", 
          text: "Thoughtful Explorer", 
          description: "I like to consider all my options carefully",
          subtypes: [
            { emoji: "📊", text: "Data-Driven", description: "I need facts and research" },
            { emoji: "🔍", text: "Option Weigher", description: "I compare pros and cons" }
          ]
        }
      ],
      options: [
        { emoji: "⚡", text: "Quick & Decisive", description: "I know what I want fast!" },
        { emoji: "🤔", text: "Thoughtful Explorer", description: "I like to consider options" },
        { emoji: "🎯", text: "Goal-Oriented", description: "I focus on what matters most" },
        { emoji: "🎲", text: "Fun & Spontaneous", description: "I enjoy the surprise factor" }
      ]
    },
    {
      title: "I want to improve…",
      description: "Pick one to start — you can always explore more later.",
      type: "interests",
      primaryOptions: [
        { emoji: "🕒", text: "My time management", description: "Better planning and scheduling" },
        { emoji: "✅", text: "My daily focus", description: "Reduce distractions and stay on track" },
        { emoji: "📱", text: "My digital clutter", description: "Organize apps, files, and photos" }
      ],
      additionalOptions: [
        { emoji: "💡", text: "My decision-making skills", description: "Make choices faster and with confidence" },
        { emoji: "🧘", text: "My work-life balance", description: "Create healthier boundaries" },
        { emoji: "💪", text: "My productivity habits", description: "Build better daily routines" },
        { emoji: "🎯", text: "My goal achievement", description: "Turn plans into completed projects" }
      ],
      options: [
        { emoji: "🕒", text: "My time management", description: "Better planning and scheduling" },
        { emoji: "✅", text: "My daily focus", description: "Reduce distractions and stay on track" },
        { emoji: "📱", text: "My digital clutter", description: "Organize apps, files, and photos" },
        { emoji: "💡", text: "My decision-making skills", description: "Make choices faster and with confidence" },
        { emoji: "🧘", text: "My work-life balance", description: "Create healthier boundaries" }
      ]
    },
    {
      title: "🎉 You're All Set!",
      description: "Your personalized decision journey begins now!",
      type: "celebration",
      personality: "Time for your first win! 🎊"
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
      }, 1000);
    }
  };


  const selectInterest = async (interest: string) => {
    const isAlreadySelected = selectedInterests.includes(interest);
    
    if (!isAlreadySelected) {
      // Trigger TikTok-like bounce animation
      setRecentlySelected(interest);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Show mini confetti for selection
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
      
      // Clear recent selection after animation
      setTimeout(() => setRecentlySelected(null), 600);
      
      // Add affirmative feedback after a short delay
      setTimeout(() => {
        console.log(`✅ Got it! We'll help you boost your ${interest.toLowerCase().replace('my ', '')}.`);
      }, 300);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleBroadQuizAnswer = async (category: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedQuizCategory(category);
    setShowDetailedQuiz(true);
  };

  const handleDetailedQuizAnswer = async (answer: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Store the answer (in a real app, you'd save this to user preferences)
    setSelectedDecisionStyle(answer);
    console.log('Selected decision style:', answer);
    handleNext();
  };

  const handleQuizAnswer = async (answer: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Store the answer (in a real app, you'd save this to user preferences)
    setSelectedDecisionStyle(answer);
    console.log('Selected decision style:', answer);
    handleNext();
  };

  const handleSignInGoogle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await signInWithGoogle();
    // If coming from preview, go directly to main app
    if (params.fromPreview) {
      router.replace('/');
    } else {
      handleNext();
    }
  };

  const handleSignInApple = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await signInWithApple();
    // If coming from preview, go directly to main app
    if (params.fromPreview) {
      router.replace('/');
    } else {
      handleNext();
    }
  };

  const handleSignInEmail = async () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signInWithEmail(trimmed);
    // If coming from preview, go directly to main app
    if (params.fromPreview) {
      router.replace('/');
    } else {
      handleNext();
    }
  };

  const renderStep = () => {
    const step = steps[currentStep];

    switch(step.type) {
      case "signup":
        return (
          <View className="flex-1 px-6 justify-between py-4">
            <Motion.View
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'timing', delay: 0.2, duration: 250 }}
            >
              {/* Welcome Icon */}
              <View className="items-center mb-6">
                <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-3">
                  <Text className="text-3xl">🎯</Text>
                </View>
                <View className="bg-white/95 backdrop-blur-sm rounded-xl p-3 mx-4">
                  <Text className="text-gray-700 font-semibold text-center text-sm">
                    {step.personality}
                  </Text>
                </View>
              </View>
              
              <Text
                className="text-2xl font-bold text-center text-white mb-3"
                style={[Typography.hero, { lineHeight: 32 }]}
              >
                {step.title}
              </Text>
              <Text className="text-white/80 text-center text-base mb-8" style={{ lineHeight: 20 }}>
                {step.description}
              </Text>
            </Motion.View>

            {/* Sign up options */}
            <View className="w-full gap-3">
              {/* Primary CTA - Google */}
              <TouchableOpacity
                className="bg-white rounded-xl py-4 items-center border border-white/30 shadow-lg"
                onPress={handleSignInGoogle}
              >
                <View className="flex-row items-center">
                  <Image 
                    source={require('../assets/images/google-logo.png')} 
                    style={{ width: 20, height: 20, marginRight: 12 }}
                    resizeMode="contain"
                  />
                  <Text className="text-indigo-700 font-bold text-base">Continue with Google</Text>
                </View>
              </TouchableOpacity>

              {/* Secondary options dropdown */}
              <TouchableOpacity
                className="bg-white/10 backdrop-blur-sm rounded-xl py-3 items-center border border-white/30"
                onPress={handleSignInApple}
              >
                <View className="flex-row items-center">
                  <Image 
                    source={require('../assets/images/apple-logo.png')} 
                    style={{ width: 18, height: 18, marginRight: 10 }}
                    resizeMode="contain"
                  />
                  <Text className="text-white font-medium text-sm">Continue with Apple</Text>
                </View>
              </TouchableOpacity>

              <View className="flex-row items-center my-1">
                <View className="flex-1 h-px bg-white/30" />
                <Text className="mx-3 text-white/70 text-sm">or</Text>
                <View className="flex-1 h-px bg-white/30" />
              </View>

              <View className="bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                <TextInput
                  placeholder="you@example.com"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  style={{ color: 'white', fontSize: 16 }}
                />
              </View>
              <TouchableOpacity
                className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl py-3 items-center"
                onPress={handleSignInEmail}
              >
                <View className="flex-row items-center">
                  <Mail color="white" size={18} style={{ marginRight: 10 }} />
                  <Text className="text-white font-bold text-sm">Continue with Email</Text>
                </View>
              </TouchableOpacity>

              {/* Social Proof - moved below CTAs */}
              <Motion.View
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mt-4 border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', delay: 0.7, duration: 300 }}
              >
                <Text className="text-white/90 text-center font-medium text-sm mb-2">
                  📊 Join the Decision Revolution
                </Text>
                <View className="flex-row justify-around">
                  <View className="items-center px-1">
                    <Text className="text-yellow-300 font-bold text-lg mb-1">12K+</Text>
                    <Text className="text-white/60 text-xs text-center leading-3">decisions{"\n"}this week</Text>
                  </View>
                  <View className="items-center px-1">
                    <Text className="text-green-300 font-bold text-lg mb-1">2K+</Text>
                    <Text className="text-white/60 text-xs text-center leading-3">lives{"\n"}improved</Text>
                  </View>
                  <View className="items-center px-1">
                    <Text className="text-blue-300 font-bold text-lg mb-1">94%</Text>
                    <Text className="text-white/60 text-xs text-center leading-3">feel more{"\n"}organized</Text>
                  </View>
                </View>
              </Motion.View>
            </View>
          </View>
        );

      case "quiz":
        return (
          <Motion.View
            className="flex-1 px-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'timing', delay: 0.2, duration: 250 }}
          >
            <Text
              className="text-2xl font-bold text-center text-white mb-3"
              style={[Typography.hero, { lineHeight: 32 }]}
            >
              {step.title}
            </Text>
            <Text className="text-white/80 text-center text-base mb-4" style={{ lineHeight: 20 }}>
              {step.description}
            </Text>

            <Text className="text-white font-semibold text-lg mb-6 text-center" style={{ lineHeight: 24 }}>
              {showDetailedQuiz 
                ? `Great! What type of ${selectedQuizCategory?.toLowerCase()} are you?`
                : step.question}
            </Text>

            <View className="gap-3">
              {!showDetailedQuiz ? (
                // Show broad categories first
                step.broadOptions?.map((option, index) => (
                  <Motion.View
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'timing', delay: 0.3 + (index * 0.1), duration: 250 }}
                  >
                    <TouchableOpacity
                      className="bg-white/10 backdrop-blur-md rounded-xl py-5 px-4 border border-white/20"
                      onPress={() => handleBroadQuizAnswer(option.text)}
                    >
                      <View className="flex-row items-center">
                        <View className="w-12 h-12 items-center justify-center mr-4">
                          <Text className="text-4xl" style={{ lineHeight: 48, textAlign: 'center' }}>{option.emoji}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-white font-bold text-lg mb-1" style={{ lineHeight: 22 }}>
                            {option.text}
                          </Text>
                          <Text className="text-white/70 text-sm" style={{ lineHeight: 18 }}>
                            {option.description}
                          </Text>
                        </View>
                        <View className="w-6 h-6 items-center justify-center ml-2">
                          <Text className="text-white/60 text-xl">→</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Motion.View>
                ))
              ) : (
                // Show detailed subtypes
                step.broadOptions?.find(opt => opt.text === selectedQuizCategory)?.subtypes?.map((subtype, index) => (
                  <Motion.View
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'timing', delay: 0.1 + (index * 0.1), duration: 250 }}
                  >
                    <TouchableOpacity
                      className="bg-white/10 backdrop-blur-md rounded-xl py-4 px-4 border border-white/20"
                      onPress={() => handleDetailedQuizAnswer(subtype.text)}
                    >
                      <View className="flex-row items-center">
                        <View className="w-10 h-10 items-center justify-center mr-3">
                          <Text className="text-3xl" style={{ lineHeight: 36, textAlign: 'center' }}>{subtype.emoji}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-white font-bold text-base mb-1" style={{ lineHeight: 20 }}>
                            {subtype.text}
                          </Text>
                          <Text className="text-white/70 text-xs" style={{ lineHeight: 16 }}>
                            {subtype.description}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Motion.View>
                ))
              )}
              
              {showDetailedQuiz && (
                <Motion.View
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'timing', delay: 0.4, duration: 250 }}
                >
                  <TouchableOpacity
                    className="bg-white/5 rounded-xl py-3 px-4 border border-white/10 mt-2"
                    onPress={() => {
                      setShowDetailedQuiz(false);
                      setSelectedQuizCategory(null);
                    }}
                  >
                    <Text className="text-white/60 text-center text-sm">← Back to categories</Text>
                  </TouchableOpacity>
                </Motion.View>
              )}
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
            {/* Big Title */}
            <View className="pt-12 pb-8">
              <Text
                className="text-4xl font-bold text-center text-white mb-4"
                style={[Typography.hero, { lineHeight: 48 }]}
              >
                {step.title}
              </Text>
            </View>

            {/* Scrollable Options List */}
            <ScrollView 
              className="flex-1" 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View className="gap-4">
                {/* Primary options - always shown */}
                {step.primaryOptions?.map((option, index) => {
                  const isSelected = selectedInterests.includes(option.text);
                  const isRecentlySelected = recentlySelected === option.text;
                  
                  return (
                    <Motion.View
                      key={`primary-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: isRecentlySelected ? [1, 1.05, 1] : 1,
                      }}
                      transition={{ 
                        type: 'timing', 
                        delay: 0.1 + (index * 0.1), 
                        duration: isRecentlySelected ? 400 : 300,
                      }}
                    >
                      <TouchableOpacity
                        className={`rounded-2xl py-5 px-5 border ${
                          isSelected
                            ? 'bg-white/20 border-yellow-400'
                            : 'bg-white/10 border-white/20'
                        }`}
                        onPress={() => selectInterest(option.text)}
                      >
                        <View className="flex-row items-center">
                          <Motion.View 
                            className="w-12 h-12 items-center justify-center mr-4"
                            animate={{ 
                              rotate: isSelected ? [0, 10, -10, 0] : 0 
                            }}
                            transition={{ 
                              duration: 600,
                              delay: isSelected ? 100 : 0
                            }}
                          >
                            <Text 
                              className="text-4xl"
                              style={{ lineHeight: 48, textAlign: 'center' }}
                            >
                              {option.emoji}
                            </Text>
                          </Motion.View>
                          <View className="flex-1">
                            <Text className={`font-bold text-lg mb-1 ${
                              isSelected
                                ? 'text-yellow-300'
                                : 'text-white'
                            }`} style={{ lineHeight: 22 }}>
                              {option.text}
                            </Text>
                            <Text className="text-white/70 text-sm" style={{ lineHeight: 18 }}>
                              {option.description}
                            </Text>
                          </View>
                          {isSelected && (
                            <Motion.View 
                              className="w-6 h-6 items-center justify-center"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring' }}
                            >
                              <Text className="text-yellow-400 text-2xl">✓</Text>
                            </Motion.View>
                          )}
                        </View>
                      </TouchableOpacity>
                    </Motion.View>
                  );
                })}
                
                {/* See More button */}
                {!showAllInterests && step.additionalOptions && (
                  <Motion.View
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'timing', delay: 0.4, duration: 300 }}
                  >
                    <TouchableOpacity
                      className="bg-white/5 border border-white/20 rounded-2xl py-4 px-5"
                      onPress={() => setShowAllInterests(true)}
                    >
                      <View className="flex-row items-center justify-center">
                        <Text className="text-white/80 font-medium text-base mr-2">
                          See More Options
                        </Text>
                        <Text className="text-white/60 text-lg">↓</Text>
                      </View>
                    </TouchableOpacity>
                  </Motion.View>
                )}
                
                {/* Additional options - shown when expanded */}
                {showAllInterests && step.additionalOptions?.map((option, index) => {
                  const isSelected = selectedInterests.includes(option.text);
                  const isRecentlySelected = recentlySelected === option.text;
                  
                  return (
                    <Motion.View
                      key={`additional-${index}`}
                      initial={{ opacity: 0, y: 20, height: 0 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        height: 'auto',
                        scale: isRecentlySelected ? [1, 1.05, 1] : 1,
                      }}
                      transition={{ 
                        type: 'timing', 
                        delay: 0.1 + (index * 0.1), 
                        duration: isRecentlySelected ? 400 : 300,
                      }}
                    >
                      <TouchableOpacity
                        className={`rounded-2xl py-5 px-5 border ${
                          isSelected
                            ? 'bg-white/20 border-yellow-400'
                            : 'bg-white/10 border-white/20'
                        }`}
                        onPress={() => selectInterest(option.text)}
                      >
                        <View className="flex-row items-center">
                          <Motion.View 
                            className="w-12 h-12 items-center justify-center mr-4"
                            animate={{ 
                              rotate: isSelected ? [0, 10, -10, 0] : 0 
                            }}
                            transition={{ 
                              duration: 600,
                              delay: isSelected ? 100 : 0
                            }}
                          >
                            <Text 
                              className="text-4xl"
                              style={{ lineHeight: 48, textAlign: 'center' }}
                            >
                              {option.emoji}
                            </Text>
                          </Motion.View>
                          <View className="flex-1">
                            <Text className={`font-bold text-lg mb-1 ${
                              isSelected
                                ? 'text-yellow-300'
                                : 'text-white'
                            }`} style={{ lineHeight: 22 }}>
                              {option.text}
                            </Text>
                            <Text className="text-white/70 text-sm" style={{ lineHeight: 18 }}>
                              {option.description}
                            </Text>
                          </View>
                          {isSelected && (
                            <Motion.View 
                              className="w-6 h-6 items-center justify-center"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring' }}
                            >
                              <Text className="text-yellow-400 text-2xl">✓</Text>
                            </Motion.View>
                          )}
                        </View>
                      </TouchableOpacity>
                    </Motion.View>
                  );
                })}
              </View>
              
              {/* Supporting Copy */}
              <Motion.View
                className="pt-8 pb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', delay: 0.8, duration: 300 }}
              >
                <Text className="text-white/70 text-center text-base" style={{ lineHeight: 20 }}>
                  {step.description}
                </Text>
              </Motion.View>
            </ScrollView>
          </Motion.View>
        );

      case "celebration":
        const primaryInterest = selectedInterests[0];
        const interestText = primaryInterest ? primaryInterest.toLowerCase().replace('my ', '') : 'productivity';
        const styleText = selectedDecisionStyle ? selectedDecisionStyle.toLowerCase() : 'thoughtful';
        
        return (
          <Motion.View
            className="flex-1 items-center justify-center px-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', delay: 0.2, duration: 250 }}
          >
            {/* Confetti celebration */}
            <Motion.View
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ type: 'timing', duration: 500 }}
            >
              <Text className="text-5xl mb-4">🎉</Text>
            </Motion.View>
            
            {/* Personalized title */}
            <Text
              className="text-2xl font-bold text-center text-white mb-3"
              style={[Typography.hero, { lineHeight: 32 }]}
            >
              {params.fromPreview 
                ? "Ready to Unlock More Wins?" 
                : `🎉 You're set to improve your ${interestText}!`}
            </Text>
            
            {/* Personalized description */}
            <Text className="text-white/80 text-center text-base mb-4" style={{ lineHeight: 20 }}>
              {params.fromPreview 
                ? "You've seen what's possible. Let's make it official!" 
                : `With your ${styleText} style, you'll make smarter choices every day.`}
            </Text>

            {/* Streak preview */}
            <Motion.View
              className="bg-white/15 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20 w-full max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'timing', delay: 0.5, duration: 300 }}
            >
              <View className="flex-row items-center justify-center mb-3">
                <Text className="text-2xl mr-2">🔥</Text>
                <Text className="text-white font-bold text-lg">Day 1 of your streak</Text>
              </View>
              <Text className="text-white/70 text-center text-sm mb-2">
                Starting your smart decision journey now!
              </Text>
              <View className="flex-row justify-center">
                <View className="w-8 h-8 bg-yellow-500 rounded-full items-center justify-center mr-1">
                  <Text className="text-white font-bold text-xs">1</Text>
                </View>
                {[2, 3, 4, 5, 6, 7].map((day) => (
                  <View key={day} className="w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-1">
                    <Text className="text-white/50 font-bold text-xs">{day}</Text>
                  </View>
                ))}
              </View>
            </Motion.View>

            <Text className="text-yellow-300 text-center text-lg font-medium mb-6">
              {params.fromPreview 
                ? "Sign up to unlock unlimited smart decisions! 🚀" 
                : "Time for your first win! 🎊"}
            </Text>

            {!params.fromPreview && (
              <Motion.View
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'timing', delay: 0.8, duration: 300 }}
              >
                <TouchableOpacity
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 rounded-2xl shadow-lg"
                  onPress={handleNext}
                >
                  <Text className="text-white font-bold text-xl">
                    Let's Start! 🚀
                  </Text>
                </TouchableOpacity>
              </Motion.View>
            )}
          </Motion.View>
        );

      default: // Welcome screen or Sign-up for preview users
        if (params.fromPreview) {
          // Show sign-up options for preview users
          return (
            <View className="flex-1 px-6 justify-between py-4">
              <Motion.View
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'timing', delay: 0.2, duration: 250 }}
              >
                {/* Welcome Icon */}
                <View className="items-center mb-6">
                  <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-3">
                    <Text className="text-3xl">🎯</Text>
                  </View>
                  <View className="bg-white/95 backdrop-blur-sm rounded-xl p-3 mx-4">
                    <Text className="text-gray-700 font-semibold text-center text-sm">
                      Ready to unlock unlimited wins? 🚀
                    </Text>
                  </View>
                </View>
                
                <Text
                  className="text-2xl font-bold text-center text-white mb-3"
                  style={[Typography.hero, { lineHeight: 32 }]}
                >
                  Let's Make It Official!
                </Text>
              <Text className="text-white/80 text-center text-base mb-8" style={{ lineHeight: 20 }}>
                Sign up to continue your smart decision journey!
              </Text>
              </Motion.View>

              {/* Sign up options */}
              <View className="w-full gap-3">
                {/* Primary CTA - Google */}
                <TouchableOpacity
                  className="bg-white rounded-xl py-4 items-center border border-white/30 shadow-lg"
                  onPress={handleSignInGoogle}
                >
                  <View className="flex-row items-center">
                    <Image 
                      source={require('../assets/images/google-logo.png')} 
                      style={{ width: 20, height: 20, marginRight: 12 }}
                      resizeMode="contain"
                    />
                    <Text className="text-indigo-700 font-bold text-base">Continue with Google</Text>
                  </View>
                </TouchableOpacity>

                {/* Secondary options */}
                <TouchableOpacity
                  className="bg-white/10 backdrop-blur-sm rounded-xl py-3 items-center border border-white/30"
                  onPress={handleSignInApple}
                >
                  <View className="flex-row items-center">
                    <Image 
                      source={require('../assets/images/apple-logo.png')} 
                      style={{ width: 18, height: 18, marginRight: 10 }}
                      resizeMode="contain"
                    />
                    <Text className="text-white font-medium text-sm">Continue with Apple</Text>
                  </View>
                </TouchableOpacity>

                <View className="flex-row items-center my-1">
                  <View className="flex-1 h-px bg-white/30" />
                  <Text className="mx-3 text-white/70 text-sm">or</Text>
                  <View className="flex-1 h-px bg-white/30" />
                </View>

                <View className="bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                  <TextInput
                    placeholder="you@example.com"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    style={{ color: 'white', fontSize: 16 }}
                  />
                </View>
                <TouchableOpacity
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl py-3 items-center"
                  onPress={handleSignInEmail}
                >
                  <View className="flex-row items-center">
                    <Mail color="white" size={18} style={{ marginRight: 10 }} />
                    <Text className="text-white font-bold text-sm">Continue with Email</Text>
                  </View>
                </TouchableOpacity>

                {/* Social Proof - moved below CTAs */}
                <Motion.View
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mt-4 border border-white/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'timing', delay: 0.7, duration: 300 }}
                >
                  <Text className="text-white/90 text-center font-medium text-sm mb-2">
                    📊 Join the Decision Revolution
                  </Text>
                  <View className="flex-row justify-around">
                    <View className="items-center px-1">
                      <Text className="text-yellow-300 font-bold text-lg mb-1">12K+</Text>
                      <Text className="text-white/60 text-xs text-center leading-3">decisions{"\n"}this week</Text>
                    </View>
                    <View className="items-center px-1">
                      <Text className="text-green-300 font-bold text-lg mb-1">2K+</Text>
                      <Text className="text-white/60 text-xs text-center leading-3">lives{"\n"}improved</Text>
                    </View>
                    <View className="items-center px-1">
                      <Text className="text-blue-300 font-bold text-lg mb-1">94%</Text>
                      <Text className="text-white/60 text-xs text-center leading-3">feel more{"\n"}organized</Text>
                    </View>
                  </View>
                </Motion.View>
              </View>
            </View>
          );
        } else {
          // Simplified first welcome screen
          return (
            <Motion.View
              className="flex-1 items-center justify-center px-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', delay: 0.2, duration: 300 }}
            >
              {/* Top Section - Large Icon */}
              <Motion.View 
                className="items-center mb-16"
                initial={{ opacity: 0, y: -30 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: 1.05
                }}
                transition={{ 
                  type: 'timing', 
                  delay: 0.4, 
                  duration: 300
                }}
              >
                <Text className="text-8xl mb-4">⏳</Text>
              </Motion.View>

              {/* Middle Section - Headline */}
              <Motion.View 
                className="items-center mb-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'timing', delay: 0.6, duration: 300 }}
              >
                <Text
                  className="text-3xl font-bold text-center text-white mb-4 leading-tight"
                  style={[Typography.hero]}
                >
                  {step.title}
                </Text>
                <Text className="text-white/80 text-center text-lg" style={{ lineHeight: 24 }}>
                  {step.description}
                </Text>
              </Motion.View>

              {/* Bottom Section - Single CTA */}
              <Motion.View
                className="w-full items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'timing', delay: 0.8, duration: 300 }}
              >
                <Motion.View
                  animate={{ 
                    shadowOpacity: 0.6,
                  }}
                  transition={{
                    type: 'timing',
                    duration: 3000,
                  }}
                  style={{
                    shadowColor: '#FDE047',
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 15,
                    shadowOpacity: 0.3,
                  }}
                >
                  <TouchableOpacity
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 px-12 py-5 rounded-2xl w-4/5 max-w-xs"
                    onPress={handleNext}
                  >
                    <Text className="text-white font-bold text-xl text-center">
                      Get Started
                    </Text>
                  </TouchableOpacity>
                </Motion.View>
              </Motion.View>
            </Motion.View>
          );
        }
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
        


        {/* Step content */}
        <View className="flex-1">
          {renderStep()}
        </View>

        {/* Progress indicator - subtle microtext at bottom */}
        {!params.fromPreview && currentStep < steps.length - 1 && (
          <Motion.View 
            className="pb-6 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', delay: 1, duration: 300 }}
          >
            <View className="flex-row justify-center items-center">
              <Text className="text-white/40 text-xs">
                Step {currentStep + 1} of {steps.length}
              </Text>
              <View className="flex-row ml-3">
                {steps.map((_, index) => (
                  <Motion.View
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                      index <= currentStep ? 'bg-yellow-400' : 'bg-white/20'
                    }`}
                    animate={{
                      scale: index === currentStep ? 1.3 : 1,
                    }}
                    transition={{
                      type: 'timing',
                      duration: index === currentStep ? 800 : 200,
                    }}
                  />
                ))}
              </View>
            </View>
          </Motion.View>
        )}


        {/* Confetti Animation */}
        <Confetti
          active={showConfetti}
          onComplete={() => setShowConfetti(false)}
          {...ConfettiPresets.success}
          particleCount={30}
        />
      </LinearGradient>
    </View>
  );
};

export default OnboardingScreen;