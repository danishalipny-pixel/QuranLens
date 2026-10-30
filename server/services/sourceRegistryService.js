class SourceRegistryService {
  constructor() {
    this.sources = [
      {
        id: 'src_nasa_01',
        title: 'Astrophysics & Cosmic Structure',
        institution: 'National Aeronautics and Space Administration (NASA)',
        domain: 'Universe & Astronomy',
        category: 'Space Agency',
        url: 'https://science.nasa.gov/astrophysics/',
        description: 'Primary repository for cosmic expansion, observational cosmology, and stellar nucleosynthesis data.',
        verified: true,
      },
      {
        id: 'src_noaa_01',
        title: 'National Ocean Service: Density Fronts and Estuaries',
        institution: 'National Oceanic and Atmospheric Administration (NOAA)',
        domain: 'Oceans & Environmental systems',
        category: 'Oceanographic Agency',
        url: 'https://oceanservice.noaa.gov/facts/estuary.html',
        description: 'Physical oceanography, thermohaline circulation, pycnocline and halocline stratification data.',
        verified: true,
      },
      {
        id: 'src_usgs_01',
        title: 'USGS Water Science School: The Global Hydrological Cycle',
        institution: 'United States Geological Survey (USGS)',
        domain: 'Water & Rainfall',
        category: 'Geological Survey',
        url: 'https://www.usgs.gov/special-topics/water-science-school',
        description: 'Infiltration, groundwater recharge, aquifers, and subterranean spring recharge data.',
        verified: true,
      },
      {
        id: 'src_usgs_02',
        title: 'Plate Tectonics, Mountain Roots & Isostasy',
        institution: 'United States Geological Survey (USGS)',
        domain: 'Earth & Geology',
        category: 'Geological Survey',
        url: 'https://pubs.usgs.gov/gip/dynamic/understanding.html',
        description: 'Crustal equilibrium, Airy-Pratt isostatic buoyancy models, and lithospheric roots.',
        verified: true,
      },
      {
        id: 'src_nih_01',
        title: 'National Center for Biotechnology Information (NCBI)',
        institution: 'National Institutes of Health (NIH)',
        domain: 'Human creation & development',
        category: 'Biomedical Institute',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK541062/',
        description: 'Peer-reviewed anatomical and embryological literature on somite formation and prenatal morphogenesis.',
        verified: true,
      },
      {
        id: 'src_nature_01',
        title: 'Nature Geoscience & Nature Ecology',
        institution: 'Nature Publishing Group (Springer Nature)',
        domain: 'Plants & Agriculture',
        category: 'Peer-Reviewed Journal',
        url: 'https://www.nature.com',
        description: 'Ecology, chlorophyll photosynthesis, and global geochemical cycles.',
        verified: true,
      },
      {
        id: 'src_who_01',
        title: 'World Health Organization (WHO) Environmental Health',
        institution: 'World Health Organization',
        domain: 'Oceans & Environmental systems',
        category: 'Global Health Authority',
        url: 'https://www.who.int/health-topics/water-sanitation-and-hygiene-wash',
        description: 'Global freshwater standards, planetary health, and atmospheric quality guidelines.',
        verified: true,
      },
    ];
  }

  getAllSources(categoryFilter = null) {
    if (categoryFilter && categoryFilter !== 'All') {
      return this.sources.filter((s) => s.domain === categoryFilter || s.category === categoryFilter);
    }
    return this.sources;
  }

  addSource(sourceData) {
    const newSource = {
      id: 'src_' + Date.now(),
      title: sourceData.title,
      institution: sourceData.institution,
      domain: sourceData.domain || 'General Science',
      category: sourceData.category || 'Academic Institution',
      url: sourceData.url || '#',
      description: sourceData.description || '',
      verified: true,
      addedAt: new Date().toISOString(),
    };
    this.sources.unshift(newSource);
    return newSource;
  }

  deleteSource(id) {
    this.sources = this.sources.filter((s) => s.id !== id);
    return true;
  }
}

module.exports = new SourceRegistryService();
