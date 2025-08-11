import { z } from 'zod';

// 날씨 데이터 스키마 정의
export const WeatherDataSchema = z.object({
  temperature: z.number(),
  feelsLike: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  description: z.string(),
  icon: z.string(),
  location: z.string()
});

export type WeatherData = z.infer<typeof WeatherDataSchema>;

export class WeatherService {
  private baseUrl: string = 'https://api.open-meteo.com/v1/forecast';

  async getWeatherByCity(city: string): Promise<WeatherData> {
    // 도시별 좌표 하드코딩 (실제 프로덕트에서는 지오코딩 API 필요)
    const cityCoordinates: {[key: string]: {lat: number, lon: number}} = {
      'Seoul': { lat: 37.5665, lon: 126.9780 },
      'Busan': { lat: 35.1796, lon: 129.0756 },
      'Incheon': { lat: 37.4563, lon: 126.7052 },
      'Daegu': { lat: 35.8714, lon: 128.6014 },
      'Daejeon': { lat: 36.3504, lon: 127.3845 }
    };

    const coordinates = cityCoordinates[city] || cityCoordinates['Seoul'];

    return this.getWeatherByCoordinates(coordinates.lat, coordinates.lon);
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseUrl}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=celsius`
      );

      if (!response.ok) {
        throw new Error('날씨 정보를 가져오는 데 실패했습니다.');
      }

      const data = await response.json();

      // 날씨 코드를 설명으로 변환
      const weatherDescriptions: {[key: number]: string} = {
        0: '맑음',
        1: '대부분 맑음',
        2: '약간 흐림',
        3: '흐림',
        45: '안개',
        48: '서리 안개',
        51: '가벼운 이슬비',
        53: '보통 이슬비',
        55: '짙은 이슬비',
        61: '가벼운 비',
        63: '보통 비',
        65: '폭우',
        71: '가벼운 눈',
        73: '보통 눈',
        75: '폭설',
        77: '눈 알갱이',
        80: '가벼운 소나기',
        81: '보통 소나기',
        82: '폭우성 소나기',
        85: '가벼운 눈 소나기',
        86: '폭설 소나기'
      };

      return {
        temperature: data.current.temperature_2m,
        feelsLike: data.current.temperature_2m, // Open-Meteo는 체감온도 제공 안함
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        description: weatherDescriptions[data.current.weather_code] || '날씨 정보 없음',
        icon: this.getWeatherIcon(data.current.weather_code),
        location: this.getCityName(lat, lon)
      };
    } catch (error) {
      console.error('날씨 데이터 가져오기 실패:', error);
      throw error;
    }
  }

  // 날씨 아이콘 매핑
  private getWeatherIcon(weatherCode: number): string {
    if ([0, 1].includes(weatherCode)) return 'clear';
    if ([2, 3].includes(weatherCode)) return 'partly-cloudy';
    if ([45, 48].includes(weatherCode)) return 'fog';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) return 'rain';
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return 'snow';
    return 'default';
  }

  // 간단한 도시명 반환 (실제로는 리버스 지오코딩 필요)
  private getCityName(lat: number, lon: number): string {
    const cityCoordinates: {[key: string]: {lat: number, lon: number}} = {
      'Seoul': { lat: 37.5665, lon: 126.9780 },
      'Busan': { lat: 35.1796, lon: 129.0756 },
      'Incheon': { lat: 37.4563, lon: 126.7052 },
      'Daegu': { lat: 35.8714, lon: 128.6014 },
      'Daejeon': { lat: 36.3504, lon: 127.3845 }
    };

    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (coords.lat.toFixed(2) === lat.toFixed(2) && coords.lon.toFixed(2) === lon.toFixed(2)) {
        return city;
      }
    }
    return '알 수 없는 위치';
  }

  // 날씨 기반 우선순위 결정
  getWeatherBasedPriority(weather: WeatherData): 'low' | 'medium' | 'high' {
    const { temperature, windSpeed } = weather;

    if (temperature > 30 || temperature < 0 || windSpeed > 10) {
      return 'high';
    }

    if ((temperature > 25 && temperature <= 30) || (temperature >= 0 && temperature < 10)) {
      return 'medium';
    }

    return 'low';
  }

  // 날씨 기반 추천사항
  getWeatherRecommendation(weather: WeatherData): string {
    const { temperature, description } = weather;

    if (description.includes('비')) {
      return '우산을 챙기세요. 비가 올 수 있습니다.';
    }

    if (description.includes('눈')) {
      return '따뜻한 옷과 장갑을 준비하세요.';
    }

    if (temperature > 30) {
      return '충분한 수분 섭취와 햇빛 차단에 유의하세요.';
    }

    if (temperature < 0) {
      return '방한 장비를 꼭 챙기고 체온 유지에 신경 쓰세요.';
    }

    return '오늘도 좋은 하루 되세요!';
  }
}

// 인스턴스 생성 (API 키 불필요)
export const weatherService = new WeatherService();
