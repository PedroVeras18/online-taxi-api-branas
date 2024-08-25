import { ValueObject } from "@/core/value-object";

interface CoordinateProps {
  latitude: number;
  longitude: number;
}

export class Coordinate extends ValueObject<CoordinateProps> {
  static create(props: CoordinateProps): Coordinate {
    if (props.latitude < -90 || props.latitude > 90) throw new Error("Latitude inválida.");
    if (props.longitude < -180 || props.longitude > 180) throw new Error("Longitude inválida.");

    return new Coordinate({ ...props })
  }

  get latitude() {
    return this.value.latitude;
  }

  get longitude() {
    return this.value.longitude;
  }
}