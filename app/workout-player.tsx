import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Vibration } from 'react-native';
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX } from 'lucide-react-native';

export default function WorkoutPlayerScreen() {
  // Mock workout data
  const workout = {
    id: 'workout-1',
    title: 'Morning Energy Boost',
    duration: 300, // 5 minutes in seconds
    description: 'Quick energy boost to start your day right',
    steps: [
      {
        id: 'step-1',
        title: 'Warm-up',
        duration: 30,
        description: 'Gentle movements to prepare your body'
      },
      {
        id: 'step-2',
        title: 'Jumping Jacks',
        duration: 60,
        description: 'Get your heart rate up'
      },
      {
        id: 'step-3',
        title: 'High Knees',
        duration: 60,
        description: 'Lift those knees high'
      },
      {
        id: 'step-4',
        title: 'Squats',
        duration: 60,
        description: 'Work those glutes and legs'
      },
      {
        id: 'step-5',
        title: 'Cool Down',
        duration: 30,
        description: 'Gentle stretching to finish'
      }
    ]
  };

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(workout.steps[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100

  const currentStep = workout.steps[currentStepIndex];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Step completed
            if (currentStepIndex < workout.steps.length - 1) {
              // Move to next step
              setCurrentStepIndex(prevIndex => prevIndex + 1);
              return workout.steps[prevIndex + 1].duration;
            } else {
              // Workout completed
              setIsRunning(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining, currentStepIndex, workout.steps]);

  // Progress calculation
  useEffect(() => {
    const totalDuration = workout.steps.reduce((sum, step) => sum + step.duration, 0);
    const completedDuration = workout.steps
      .slice(0, currentStepIndex)
      .reduce((sum, step) => sum + step.duration, 0);
    const currentStepProgress = ((currentStep.duration - timeRemaining) / currentStep.duration) * 100;
    const overallProgress = ((completedDuration + (currentStep.duration - timeRemaining)) / totalDuration) * 100;
    setProgress(overallProgress);
  }, [timeRemaining, currentStepIndex, workout.steps, currentStep.duration]);

  // Handle haptic feedback when timer hits certain points
  useEffect(() => {
    if (!isMuted && timeRemaining === 3) {
      Vibration.vibrate(500); // Vibrate for half a second
    }
  }, [timeRemaining, isMuted]);

  const togglePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const skipStep = () => {
    if (currentStepIndex < workout.steps.length - 1) {
      setCurrentStepIndex(prevIndex => prevIndex + 1);
      setTimeRemaining(workout.steps[currentStepIndex + 1].duration);
    } else {
      // Workout completed
      setIsRunning(false);
      setTimeRemaining(0);
    }
  };

  const resetWorkout = () => {
    setCurrentStepIndex(0);
    setTimeRemaining(workout.steps[0].duration);
    setIsRunning(false);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercentage = `${progress}%`;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900">{workout.title}</Text>
            <Text className="text-gray-500 mt-1">{workout.description}</Text>
          </View>
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
            onPress={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeX size={20} color="#4A90E2" />
            ) : (
              <Volume2 size={20} color="#4A90E2" />
            )}
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View className="h-2 bg-gray-200 rounded-full mb-8">
          <View 
            className="h-full bg-blue-500 rounded-full" 
            style={{ width: progressPercentage }}
          />
        </View>

        {/* Current Step */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <Text className="text-center text-gray-500 mb-2">Current Exercise</Text>
          <Text className="text-2xl font-bold text-center text-gray-900 mb-4">{currentStep.title}</Text>
          <Text className="text-center text-gray-700 mb-6">{currentStep.description}</Text>
          
          {/* Timer Circle */}
          <View className="items-center justify-center mb-6">
            <View className="w-48 h-48 rounded-full border-8 border-blue-200 items-center justify-center">
              <Text className="text-4xl font-bold text-gray-900">{formatTime(timeRemaining)}</Text>
              <Text className="text-gray-500 mt-1">remaining</Text>
            </View>
          </View>

          {/* Controls */}
          <View className="flex-row justify-center items-center">
            <TouchableOpacity 
              className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center mr-6"
              onPress={resetWorkout}
            >
              <RotateCcw size={24} color="#7F8C8D" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="w-16 h-16 rounded-full bg-blue-500 items-center justify-center"
              onPress={togglePlayPause}
            >
              {isRunning ? (
                <Pause size={32} color="white" />
              ) : (
                <Play size={32} color="white" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center ml-6"
              onPress={skipStep}
            >
              <SkipForward size={24} color="#7F8C8D" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Workout Progress */}
        <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <Text className="font-bold text-gray-900 mb-3">Workout Progress</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-24">
            <View className="flex-row gap-3">
              {workout.steps.map((step, index) => (
                <View 
                  key={step.id}
                  className={`w-24 rounded-xl p-3 items-center ${
                    index === currentStepIndex 
                      ? 'bg-blue-100 border-2 border-blue-300' 
                      : index < currentStepIndex 
                        ? 'bg-green-100' 
                        : 'bg-gray-100'
                  }`}
                >
                  <Text 
                    className={`font-bold text-center ${
                      index === currentStepIndex 
                        ? 'text-blue-800' 
                        : index < currentStepIndex 
                          ? 'text-green-800' 
                          : 'text-gray-700'
                    }`}
                  >
                    {step.title}
                  </Text>
                  <Text 
                    className={`text-xs mt-1 text-center ${
                      index < currentStepIndex 
                        ? 'text-green-700' 
                        : 'text-gray-500'
                    }`}
                  >
                    {index < currentStepIndex ? 'Completed' : `${step.duration}s`}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Motivational Message */}
        <View className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 mb-6">
          <Text className="text-white font-bold text-center">
            {isRunning 
              ? "You're doing great! Keep going!" 
              : currentStepIndex === workout.steps.length - 1 
                ? "Workout complete! Great job!" 
                : "Ready to get started?"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}