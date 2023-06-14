import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditRecommendationCard = ({recommendations,handleDeleteRecommendations,addRecommendation}) => {
  return (
    <React.Fragment>
        {recommendations.map((rec, index) => (
          <React.Fragment key={index} style={styles.cardContainer}>
            <TextInput
              style={styles.nameText}
              value={rec.name}
              placeholder='Name'
              onChangeText={(text) => {
                setRecommendations((prevRecs) => {
                  const updatedRecs = [...prevRecs];
                  updatedRecs[index].name = text;
                  return updatedRecs;
                });
              }}
            />
            <TextInput
              style={styles.relationshipText}
              value={rec.relationship}
              placeholder='Relationship'
              onChangeText={(text) => {
                setRecommendations((prevRecs) => {
                  const updatedRecs = [...prevRecs];
                  updatedRecs[index].relationship = text;
                  return updatedRecs;
                });
              }}
            />
            <View style={styles.separator} />
            <TextInput
              style={styles.recommendationText}
              value={rec.recommendation}
              placeholder='Recommendation'
              onChangeText={(text) => {
                setRecommendations((prevRecs) => {
                  const updatedRecs = [...prevRecs];
                  updatedRecs[index].recommendation = text;
                  return updatedRecs;
                });
              }}
            />
            <Button title="Delete" onPress={() => handleDeleteRecommendations(index)} />
          </React.Fragment>
        ))}
        <Button title="Add Recommendation" onPress={addRecommendation} />
      </React.Fragment>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  relationshipText: {
    fontSize: 16,
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  recommendationText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default EditRecommendationCard;
