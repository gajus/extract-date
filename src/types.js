// @flow

export type DateMatchType = {|
  +date: string,
|};

export type DirectionType = 'DM' | 'DMY' | 'DYM' | 'MD' | 'YDM' | 'YMD' | 'MDY';

export type UserConfigurationType = {|
  +direction?: DirectionType,
  +locale?: string,
  +maximumAge?: number,
  +minimumAge?: number,
  +timezone?: string,
|};

export type ConfigurationType = {|
  +direction?: DirectionType,
  +locale: string,
  +maximumAge: number,
  +minimumAge: number,
  +timezone?: string,
|};
