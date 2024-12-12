/**
 * Interface for extending date manipulation capabilities.
 * Provides methods to add units of time (seconds, minutes, hours, etc.) to a `Date` object.
 */
interface Date {
  /** Adds the specified number of milliseconds to the date.
   * @param millis - The number of milliseconds to add.
   * @returns A new `Date` instance with the added milliseconds.
   */
  addMilliseconds(millis: number): Date;

  /**
   * Adds the specified number of seconds to the date.
   * @param seconds - The number of seconds to add.
   * @returns A new `Date` instance with the added seconds.
   */
  addSeconds(seconds: number): Date;

  /**
   * Adds the specified number of minutes to the date.
   * @param minutes - The number of minutes to add.
   * @returns A new `Date` instance with the added minutes.
   */
  addMinutes(minutes: number): Date;

  /**
   * Adds the specified number of hours to the date.
   * @param hours - The number of hours to add.
   * @returns A new `Date` instance with the added hours.
   */
  addHours(hours: number): Date;

  /**
   * Adds the specified number of days to the date.
   * @param days - The number of days to add.
   * @returns A new `Date` instance with the added days.
   */
  addDays(days: number): Date;

  /**
   * Adds the specified number of weeks to the date.
   * @param weeks - The number of weeks to add.
   * @returns A new `Date` instance with the added weeks.
   */
  addWeeks(weeks: number): Date;

  /**
   * Adds the specified number of months to the date.
   * @param months - The number of months to add.
   * @returns A new `Date` instance with the added months.
   */
  addMonths(months: number): Date;

  /**
   * Adds the specified number of years to the date.
   * @param years - The number of years to add.
   * @returns A new `Date` instance with the added years.
   */
  addYears(years: number): Date;
}

Date.prototype.addMilliseconds = function (millis: number): Date {
  return new Date(this.getTime() + millis);
};

Date.prototype.addSeconds = function (seconds: number): Date {
  return this.addMilliseconds(seconds * 1000);
};

Date.prototype.addMinutes = function (minutes: number): Date {
  return this.addSeconds(minutes * 60);
};

Date.prototype.addHours = function (hours: number): Date {
  return this.addMinutes(hours * 60);
};

Date.prototype.addDays = function (days: number): Date {
  return this.addHours(days * 24);
};

Date.prototype.addWeeks = function (weeks: number): Date {
  return this.addDays(weeks * 7);
};

Date.prototype.addMonths = function (months: number): Date {
  const date = new Date(this);
  date.setMonth(date.getMonth() + months);
  return date;
};

Date.prototype.addYears = function (years: number): Date {
  return this.addMonths(years * 12);
};
