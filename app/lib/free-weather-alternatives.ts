// 무료 날씨 API 대안들
// OpenWeatherMap 대신 사용할 수 있는 무료 API들

export interface FreeWeatherData {
  temperature: number
  condition: string
  humidity?: number
  windSpeed?: number
  description: string
}

// 1. Open-Meteo API (완전 무료)
export class OpenMeteoService {
  private baseUrl = 'https://api.open-meteo.com/v1'

  async getWeatherByCity(city: string): Promise<FreeWeatherData | null> {
    try {
      // 먼저 도시의 좌표를 가져옴
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ko&format=json`
      )
      
      if (!geoResponse.ok) {
        throw new Error('지역 정보를 가져올 수 없습니다.')
      }

      const geoData = await geoResponse.json()
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('도시를 찾을 수 없습니다.')
      }

      const { latitude, longitude } = geoData.results[0]

      // 날씨 정보 가져오기
      const weatherResponse = await fetch(
        `${this.baseUrl}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      )

      if (!weatherResponse.ok) {
        throw new Error('날씨 정보를 가져올 수 없습니다.')
      }

      const weatherData = await weatherResponse.json()
      const current = weatherData.current

      return {
        temperature: Math.round(current.temperature_2m),
        condition: this.getWeatherCondition(current.weather_code),
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        description: this.getWeatherDescription(current.weather_code)
      }
    } catch (error) {
      console.error('Open-Meteo 날씨 정보 가져오기 실패:', error)
      return null
    }
  }

  private getWeatherCondition(code: number): string {
    // WMO Weather interpretation codes
    if (code === 0) return 'Clear'
    if (code >= 1 && code <= 3) return 'Cloud'
    if (code >= 45 && code <= 48) return 'Fog'
    if (code >= 51 && code <= 55) return 'Drizzle'
    if (code >= 56 && code <= 57) return 'Freezing Drizzle'
    if (code >= 61 && code <= 65) return 'Rain'
    if (code >= 66 && code <= 67) return 'Freezing Rain'
    if (code >= 71 && code <= 75) return 'Snow'
    if (code >= 77) return 'Snow Grains'
    if (code >= 80 && code <= 82) return 'Rain Showers'
    if (code >= 85 && code <= 86) return 'Snow Showers'
    if (code >= 95) return 'Thunderstorm'
    return 'Unknown'
  }

  private getWeatherDescription(code: number): string {
    const condition = this.getWeatherCondition(code)
    switch (condition) {
      case 'Clear':
        return '맑음'
      case 'Cloud':
        return '흐림'
      case 'Fog':
        return '안개'
      case 'Drizzle':
        return '이슬비'
      case 'Rain':
        return '비'
      case 'Snow':
        return '눈'
      case 'Thunderstorm':
        return '천둥번개'
      default:
        return '알 수 없음'
    }
  }
}

// 2. WeatherAPI.com (무료 플랜)
export class WeatherAPIService {
  private apiKey: string
  private baseUrl = 'http://api.weatherapi.com/v1'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.WEATHERAPI_KEY || ''
  }

  async getWeatherByCity(city: string): Promise<FreeWeatherData | null> {
    if (!this.apiKey) {
      console.warn('WeatherAPI 키가 설정되지 않았습니다.')
      return null
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/current.json?key=${this.apiKey}&q=${encodeURIComponent(city)}&aqi=no`
      )

      if (!response.ok) {
        throw new Error(`WeatherAPI 오류: ${response.status}`)
      }

      const data = await response.json()
      const current = data.current

      return {
        temperature: Math.round(current.temp_c),
        condition: current.condition.text,
        humidity: current.humidity,
        windSpeed: current.wind_kph,
        description: current.condition.text
      }
    } catch (error) {
      console.error('WeatherAPI 날씨 정보 가져오기 실패:', error)
      return null
    }
  }
}

// 3. Mock Weather Service (API 없이 사용)
export class MockWeatherService {
  private cities = {
    'Seoul': { temp: 22, condition: 'Clear', humidity: 65, windSpeed: 3 },
    'Busan': { temp: 25, condition: 'Cloud', humidity: 70, windSpeed: 5 },
    'Jeju': { temp: 24, condition: 'Rain', humidity: 80, windSpeed: 8 }
  }

  async getWeatherByCity(city: string): Promise<FreeWeatherData | null> {
    // 실제 API 호출 대신 모의 데이터 반환
    const cityData = this.cities[city as keyof typeof this.cities] || this.cities['Seoul']
    
    // 약간의 랜덤성 추가
    const tempVariation = Math.floor(Math.random() * 6) - 3
    const humidityVariation = Math.floor(Math.random() * 20) - 10

    return {
      temperature: cityData.temp + tempVariation,
      condition: cityData.condition,
      humidity: Math.max(0, Math.min(100, cityData.humidity + humidityVariation)),
      windSpeed: cityData.windSpeed,
      description: this.getDescription(cityData.condition)
    }
  }

  private getDescription(condition: string): string {
    switch (condition) {
      case 'Clear':
        return '맑음'
      case 'Cloud':
        return '흐림'
      case 'Rain':
        return '비'
      default:
        return '보통'
    }
  }
}

// 서비스 인스턴스 생성
export const openMeteoService = new OpenMeteoService()
export const weatherAPIService = new WeatherAPIService()
export const mockWeatherService = new MockWeatherService() 