import { CountryType } from '@/_types/country';
import { getCountries } from '@/app/_lib/data-service';

// Let's imagine your colleague already built this component 😃

type SelectCountryProps = {
  id: string;
  defaultCountry: string;
  name: string;
  className: string;
};

async function SelectCountry({
  defaultCountry,
  name,
  id,
  className,
}: SelectCountryProps) {
  const countries: CountryType[] = await getCountries();

  const flag =
    countries.find((country: CountryType) => country.name === defaultCountry)
      ?.flag ?? '';

  return (
    <select
      name={name}
      id={id}
      // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value="">Select country...</option>
      {countries.map((c) => (
        <option key={c.name} value={`${c.name}%${c.flag}`}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
