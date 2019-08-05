# NTU Classroom Schedule Scraper

A website scraper that rearranges the NTU class schedule according to venue. This was made to obtain the data for use for the [class schedule finder](https://zaw.li/!/L->oo/), where the class schedule of each venue can be listed, and vacant classrooms can be found for use.

## Usage

On the command line,

```bash
node scraper.js > rooms.json
```

This produces a file `rooms.json`:

```json
{
  "NIE7-02-07": [
    {},
    {
      "1130": {
        "id": "AAA08B",
        "name": "FASHION & DESIGN: WEARABLE ART AS A SECOND SKIN",
        "t1": 1430
      },
      "1430": {
        "id": "AAA08B",
        "name": "FASHION & DESIGN: WEARABLE ART AS A SECOND SKIN",
        "t1": 1730
      }
    },
    {},
    {},
    {},
    {}
  ],
  ...
}
```

### Output Format

The root of the output is an object where the keys are the venue names sorted in alphabetical order.

```json
{
  "NIE7-02-07": [ ... ],
  "NIE3-B2-01": [ ... ],
  "3A-B2-03":   [ ... ],
  ...
}
```

The object associated with each venue is an array of length six, representing Monday [0] to Saturday [6].

```json
{
  "NIE3-B1-10": [
    { ... },
    { ... },
    { ... },
    { ... },
    { ... },
    { ... }
  ],
  ...
}
```

Associated to each day is an object where its keys are the starting times of each lesson in the 24-hour format.

```json
{
  "NIE3-B1-10": [
    {
      "830": { ... },
      "1130": { ... },
      "1430": { ... }
    },
    ...
  ],
  ...
}
```

Finally, the lesson object itself has the following elements:

1. `id`: Course ID
2. `name`: Course name
3. `only`: If the class gathers only on certain weeks (e.g. no tutorials on first weeks), this would be an array of weeks when the class is held
4. `t1`: The ending time of the lesson in the 24-hour format

```json
{
  "NIE3-B1-10": [
    {
      "830": {
        "id": "AAA18H",
        "name": "PAINTING WITH OIL & ACRYLIC",
        "only": [
          2,
          3,
          ...
          12,
          13
        ],
        "t1": 1130
      },
      ...
    },
    ...
  ],
  ...
}
```
