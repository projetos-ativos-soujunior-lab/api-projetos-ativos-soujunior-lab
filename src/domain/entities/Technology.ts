export default class Technology {
  static builder = (languages: string[], topics: string[]): string[] => {
    return [...new Set([...languages, ...topics.filter(Technology.isValid).map(topic => Technology.normalize(topic))])];
  };

  private static readonly isValid = (tech: string): boolean => {
    return Object.values(ValidTechnology).includes(tech as ValidTechnology);
  };

  private static readonly normalize = (tech: string): string => {
    switch (tech) {
      case ValidTechnology.Angular:
        return 'Angular';
      case ValidTechnology.React:
        return 'React';
      case ValidTechnology.ReactJS:
        return 'React';
      case ValidTechnology.ReactNative:
        return 'React Native';
      case ValidTechnology.Flutter:
        return 'Flutter';
      case ValidTechnology.NextJS:
        return 'NextJS';
      case ValidTechnology.NestJS:
        return 'NestJS';
      case ValidTechnology.Express:
        return 'Express';
      case ValidTechnology.Prisma:
        return 'Prisma';
      case ValidTechnology.Docker:
        return 'Docker';
      default:
        return tech;
    }
  };
}

export enum ValidTechnology {
  Angular = 'angular',
  React = 'react',
  ReactJS = 'reactjs',
  ReactNative = 'react-native',
  Flutter = 'flutter',
  NextJS = 'nextjs',
  NestJS = 'nestjs',
  Express = 'express',
  Prisma = 'prisma',
  Docker = 'docker',
}
