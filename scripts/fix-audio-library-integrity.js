const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');

function normalizeStr(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function validateMatch(title, channel, targetTitle, rawArtist) {
  const titleNorm = normalizeStr(title);
  const channelNorm = normalizeStr(channel);
  const targetTitleNorm = normalizeStr(targetTitle);

  const cleanCandidateTitle = titleNorm.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const cleanTarget = targetTitleNorm.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  const targetWords = cleanTarget
    .split(' ')
    .filter((w) => w.length > 0 && !['the', 'a', 'an', 'and', 'or', 'to', 'in', 'of', 'with', 'feat', 'ft'].includes(w));

  const exactPhraseMatch = cleanCandidateTitle.includes(cleanTarget);

  let matchedWordCount = 0;
  for (const w of targetWords) {
    if (cleanCandidateTitle.includes(w)) matchedWordCount++;
  }
  const wordMatchRatio = targetWords.length > 0 ? matchedWordCount / targetWords.length : 1;

  if (!exactPhraseMatch && wordMatchRatio < 0.6) return false;
  return true;
}

function runAuditAndFix() {
  console.log('Loading database from:', DB_PATH);
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  let fixedCount = 0;

  // 1. Direct fix for Troye Sivan - "There for You"
  const thereForYou = data.songs.find(
    (s) =>
      s.id === 'song-1238673347' ||
      (s.title && s.title.toLowerCase() === 'there for you' && s.artistName?.toLowerCase().includes('troye'))
  );
  if (thereForYou) {
    thereForYou.externalMediaId = 'pNNMr5glICM'; // Verified official Martin Garrix & Troye Sivan - There For You
    thereForYou.audioUrl = 'https://www.youtube.com/watch?v=pNNMr5glICM';
    thereForYou.sourcePlatform = 'youtube';
    fixedCount++;
    console.log('Fixed "There for You" -> assigned verified official video pNNMr5glICM');
  }

  // 2. Direct fix for Troye Sivan - "YOUTH"
  const youth = data.songs.find(
    (s) =>
      s.id === 'song-1876132247' ||
      (s.title && s.title.toLowerCase() === 'youth' && s.artistName?.toLowerCase() === 'troye sivan')
  );
  if (youth) {
    youth.externalMediaId = 'XYAghEq5Lfw'; // Verified official Troye Sivan - YOUTH
    youth.audioUrl = 'https://www.youtube.com/watch?v=XYAghEq5Lfw';
    youth.sourcePlatform = 'youtube';
    fixedCount++;
    console.log('Fixed "YOUTH" -> assigned verified official video XYAghEq5Lfw');
  }

  // 3. Direct fix for Troye Sivan - "Seventeen" & "BLUE"
  for (const s of data.songs) {
    if (s.artistName?.toLowerCase() === 'troye sivan') {
      if (s.title?.toLowerCase().includes('seventeen') && s.externalMediaId === 'lEbxexV86Vw') {
        delete s.externalMediaId;
        if (s.audioUrl?.includes('lEbxexV86Vw')) {
          s.audioUrl = 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/08/94/a5/0894a5c6-b9b5-4db4-5555-5c1a7d6e492c/mzaf_8143224343160458697.plus.aac.p.m4a';
        }
        fixedCount++;
        console.log('Fixed Troye Sivan - Seventeen: removed mismatched externalMediaId');
      }
      if (s.title?.toLowerCase().includes('blue') && s.externalMediaId === 'lEbxexV86Vw') {
        delete s.externalMediaId;
        if (s.audioUrl?.includes('lEbxexV86Vw')) {
          s.audioUrl = 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b4/0c/8a/b40c8a77-9ff6-32d3-5da5-c49b6b668ec0/mzaf_1079366471852175965.plus.aac.p.m4a';
        }
        fixedCount++;
        console.log('Fixed Troye Sivan - BLUE: removed mismatched externalMediaId');
      }
      if (s.title?.toLowerCase().includes('youth (acoustic)') && s.externalMediaId === 'XYAghEq5Lfw') {
        delete s.externalMediaId;
        fixedCount++;
        console.log('Fixed Troye Sivan - Youth (Acoustic): removed mismatched externalMediaId');
      }
    }

    // 4. Clean up corrupted Snow Patrol / Counting Stars hybrid
    if (s.id === 'song-snow-patrol-youre-all-i-have-live' && s.title === 'Counting Stars') {
      s.title = "You're All I Have";
      s.artistName = 'Snow Patrol';
      s.artistId = 'artist-snow-patrol';
      delete s.externalMediaId;
      fixedCount++;
      console.log('Fixed corrupted Snow Patrol track');
    }
  }

  console.log(`Audit complete! Fixed ${fixedCount} soundtrack associations.`);
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('Database saved successfully!');
}

runAuditAndFix();
