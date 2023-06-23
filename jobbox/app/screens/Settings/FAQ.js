import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FAQScreen = () => {
  const [faqs, setFaqs] = useState([
    {
      question: 'What is Lorem Ipsum?',
      answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      isOpen: false,
    },
    {
      question: 'Why do we use it?',
      answer: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      isOpen: false,
    },
    {
      question: 'Where does it come from?',
      answer: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
      isOpen: false,
    },
  ]);

  const toggleFAQ = (index) => {
    setFaqs((prevFaqs) => {
      const updatedFaqs = [...prevFaqs];
      updatedFaqs[index].isOpen = !updatedFaqs[index].isOpen;
      return updatedFaqs;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>FAQ</Text>
      {faqs.map((faq, index) => (
        <TouchableOpacity
          key={index}
          style={styles.faqContainer}
          onPress={() => toggleFAQ(index)}
        >
          <View style={styles.faqQuestion}>
            <Text style={styles.faqQuestionText}>{faq.question}</Text>
            <Icon
              name={faq.isOpen ? 'ios-chevron-up' : 'ios-chevron-down'}
              size={20}
              color="#888"
            />
          </View>
          {faq.isOpen && (
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  faqContainer: {
    marginBottom: 20,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 16,
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});

export default FAQScreen;
