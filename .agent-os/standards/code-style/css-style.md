# CSS Style Guide

We use the latest version of Material UI v7 (MUI v7)

Grid component has new API. Here is example for the new Grid component usage: 

<Grid container spacing={2}>
  <Grid size={{ xs: 6, md: 8 }}>
    <p>xs=6 md=8</p>
  </Grid>
  <Grid size={{ xs: 6, md: 4 }}>
    <p>xs=6 md=4</p>
  </Grid>
  <Grid size={{ xs: 6, md: 4 }}>
    <p>xs=6 md=4</p>
  </Grid>
  <Grid size={{ xs: 6, md: 8 }}>
    <p>xs=6 md=8</p>
  </Grid>
</Grid>

Please stick to this syntax when you use Grid.

When we have to use flex container we don't use Box component, but we use Stack or Grid components.
We alsways evaluate if MUI Stack component or MUI Grid component is better to be used in the scenario. 
