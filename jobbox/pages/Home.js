import { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

// Import constants and components
import { COLORS, icons, images, SIZES } from "../constants";
import Welcome from "../components/Welcome.jsx";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Removed router.push function as expo-router doesn't seem to be installed in the new structure

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
          }}
        >
          <Welcome
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            // handleClick function removed
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
