# Insert new albums into seedData.ts (before the ]; of initialAlbums at line 332)
$filePath = "c:\Users\USER\sonora-music-system\lib\seedData.ts"
$content = Get-Content $filePath -Raw -Encoding UTF8

$newAlbums = @"
,
  {
    id: 'album-bep-elephunk',
    title: 'Elephunk',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Elephunk.jpg/220px-Elephunk.jpg',
    description: 'The third studio album by The Black Eyed Peas, featuring their breakthrough global hits and a fusion of hip-hop, dance, and pop.',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    releaseDate: '2003-06-24',
    copyrightInfo: '2003 Interscope Records',
    status: 'published',
    isFeatured: true,
    songIds: ['song-bep-where-is-the-love', 'song-bep-shut-up', 'song-bep-lets-get-it-started', 'song-bep-hey-mama'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'album-bep-monkey-business',
    title: 'Monkey Business',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Monkey_Business_album_cover.jpg/220px-Monkey_Business_album_cover.jpg',
    description: 'The fourth studio album by The Black Eyed Peas, featuring their biggest commercial hits including My Humps and Dont Phunk With My Heart.',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    releaseDate: '2005-05-24',
    copyrightInfo: '2005 Interscope Records',
    status: 'published',
    isFeatured: false,
    songIds: ['song-bep-my-humps', 'song-bep-dont-phunk'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'album-bep-the-end',
    title: 'The E.N.D.',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/The_E.N.D._album_cover.jpg/220px-The_E.N.D._album_cover.jpg',
    description: 'The fifth studio album by The Black Eyed Peas featuring their massive electronic dance-pop crossover including I Gotta Feeling and Boom Boom Pow.',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    releaseDate: '2009-06-09',
    copyrightInfo: '2009 Interscope Records',
    status: 'published',
    isFeatured: true,
    songIds: ['song-bep-i-gotta-feeling', 'song-bep-boom-boom-pow', 'song-bep-meet-me-halfway'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'album-bep-the-beginning',
    title: 'The Beginning',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/55/The_Beginning_%28Black_Eyed_Peas_album%29.jpg/220px-The_Beginning_%28Black_Eyed_Peas_album%29.jpg',
    description: 'The sixth studio album by The Black Eyed Peas, continuing their signature electro-hop sound with high-energy dance tracks.',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    releaseDate: '2010-11-30',
    copyrightInfo: '2010 Interscope Records',
    status: 'published',
    isFeatured: false,
    songIds: ['song-bep-just-cant-get-enough', 'song-bep-the-time'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'album-wild-orchid-self-titled',
    title: 'Wild Orchid',
    artistId: 'artist-wild-orchid',
    artistName: 'Wild Orchid',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/8/85/Wild_Orchid_Wild_Orchid_album.jpg',
    description: 'The debut studio album by Wild Orchid, featuring upbeat R&B and dance-pop tracks that established the trio as a promising girl group.',
    genreId: 'genre-pop',
    genreName: 'Pop',
    releaseDate: '1996-08-27',
    copyrightInfo: '1996 RCA Records',
    status: 'published',
    isFeatured: false,
    songIds: ['song-wo-at-night', 'song-wo-talk-to-me', 'song-wo-supernatural'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'album-wild-orchid-oxygen',
    title: 'Oxygen',
    artistId: 'artist-wild-orchid',
    artistName: 'Wild Orchid',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/5/5b/Wild_Orchid_-_Oxygen.jpg',
    description: 'The second studio album by Wild Orchid, showcasing a more polished and mature R&B and pop sound.',
    genreId: 'genre-pop',
    genreName: 'Pop',
    releaseDate: '1998-08-25',
    copyrightInfo: '1998 RCA Records',
    status: 'published',
    isFeatured: false,
    songIds: ['song-wo-nothing-but-trouble', 'song-wo-dont-worry'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'album-lizzy-give-me-a-minute',
    title: 'Give Me a Minute',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273b8d13c8743e1f6e0b4f4c3a6',
    description: 'Lizzy McAlpine debut EP, a collection of intimate indie-folk bedroom-pop songs showcasing her confessional songwriting and layered vocal harmonies.',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    releaseDate: '2020-02-07',
    copyrightInfo: '2020 Lizzy McAlpine',
    status: 'published',
    isFeatured: false,
    songIds: ['song-lizzy-cleo', 'song-lizzy-out-of-love'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'album-lizzy-five-seconds-flat',
    title: 'five seconds flat',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a8b6c3c8f3a4b7d4e9f1a2b3',
    description: 'Lizzy McAlpine critically acclaimed debut album, blending indie-folk, chamber pop, and bedroom aesthetics into a cinematic coming-of-age narrative.',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    releaseDate: '2022-04-08',
    copyrightInfo: '2022 Lizzy McAlpine / Neon Gold Records',
    status: 'published',
    isFeatured: true,
    songIds: ['song-lizzy-doozy', 'song-lizzy-apple', 'song-lizzy-defeater', 'song-lizzy-you-suck'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'album-lizzy-older',
    title: 'Older',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2735c6e5a7b8c9d0e1f2a3b4c5d',
    description: 'Lizzy McAlpine third studio album, a lush and introspective record exploring growth, grief, and the passage of time with cinematic orchestral arrangements.',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    releaseDate: '2024-10-11',
    copyrightInfo: '2024 Lizzy McAlpine / Neon Gold Records',
    status: 'published',
    isFeatured: true,
    songIds: ['song-lizzy-older', 'song-lizzy-come-down-soon', 'song-lizzy-staying'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }
"@

# Find the closing of the last album entry before the ]; of initialAlbums
# From our earlier check, the last album ends with:
#     updatedAt: '2025-01-10T00:00:00.000Z'
#   }
# ];
$closePattern = "    updatedAt: '2025-01-10T00:00:00.000Z'`r`n  }`r`n];"
$replacement = "    updatedAt: '2025-01-10T00:00:00.000Z'`r`n  }$newAlbums`r`n];"

if ($content.Contains($closePattern)) {
    $content = $content.Replace($closePattern, $replacement)
    Write-Host "SUCCESS: Albums inserted with CRLF"
} else {
    $closePatternLF = "    updatedAt: '2025-01-10T00:00:00.000Z'`n  }`n];"
    $replacementLF = "    updatedAt: '2025-01-10T00:00:00.000Z'`n  }$newAlbums`n];"
    if ($content.Contains($closePatternLF)) {
        $content = $content.Replace($closePatternLF, $replacementLF)
        Write-Host "SUCCESS: Albums inserted with LF"
    } else {
        # Find it differently - search for the Summer Drift album end
        $idx = $content.LastIndexOf("album-summer-drift")
        if ($idx -ge 0) {
            Write-Host "Found Summer Drift at index $idx, context:"
            Write-Host $content.Substring($idx, [Math]::Min(300, $content.Length - $idx))
        }
        Write-Host "ERROR: Could not find albums insertion point"
        exit 1
    }
}

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done writing albums."
