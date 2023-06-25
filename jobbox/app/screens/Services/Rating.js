import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const RatingForm = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleReviewChange = (text) => {
    setReview(text);
  };

  const handleSubmit = () => {
    // Perform any necessary actions with the rating and review data
    // For example, you can make an API call to submit the data to a server
    console.log('Rating:', rating);
    console.log('Review:', review);
    setSubmitted(true);
  };

  if (submitted) {
    return <Text>Thank you for your submission!</Text>;
  }

  const starColor = '#FFD700'; // Yellow color for filled stars

  return (
    <View>
      <Text>Submit Your Rating</Text>
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleStarPress(star)}
            activeOpacity={0.8}
          >
            <Icon
              name={star <= rating ? 'star' : 'star-o'}
              size={30}
              color={star <= rating ? starColor : 'black'}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        value={review}
        onChangeText={handleReviewChange}
        placeholder="Optional review"
        style={{ borderWidth: 1, marginTop: 10, padding: 5 }}
      />
      <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RatingForm;
