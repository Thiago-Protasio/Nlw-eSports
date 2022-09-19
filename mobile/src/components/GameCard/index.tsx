import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { THEME } from '../../theme';

import { styles } from './styles';

export interface GameCardProps {
  id: string;
  title: string;
  _count: {
    ads: number;
  }
  bannerUrl: string;
}

interface Props extends TouchableOpacityProps {
  data: GameCardProps;
}

export function GameCard({ data, ...rest }: Props) {
  const navigation = useNavigation()

  function handleOpenGame({ id, title, bannerUrl }: GameCardProps) {
    navigation.navigate('game', { id, title, bannerUrl })
  }

  return (
    <TouchableOpacity onPress={() => handleOpenGame(data)} style={styles.container}>
      <ImageBackground
        style={styles.cover}
        source={{ uri: data.bannerUrl }}
      >

        <LinearGradient
          colors={THEME.COLORS.FOOTER}
          style={styles.footer}
        >
          <Text style={styles.name}>
            {data.title}
          </Text>

          <Text style={styles.ads}>
            {data._count.ads} anúncios
          </Text>

        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}