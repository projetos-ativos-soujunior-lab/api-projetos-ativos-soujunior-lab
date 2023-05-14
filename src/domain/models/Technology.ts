export class Technology {
  name = '';

  static isTech = (tech: string): boolean => {
    return Object.values(AllowedTechnologies).includes(tech as AllowedTechnologies);
  };
}

export enum AllowedTechnologies {
  Angular = 'angular',
  React = 'react',
  ReactJS = 'reactjs',
  ReactNative = 'react-native',
  Vue = 'vue',
  VueJS = 'vuejs',
  Flutter = 'flutter',
  NextJS = 'nextjs',
  NestJS = 'nestjs',
  Express = 'express',
  Prisma = 'prisma',
  Docker = 'docker',
}
