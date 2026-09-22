import * as cheerio from 'cheerio'
import { $fetch, type FetchOptions } from 'ofetch'
import { NotFound } from '../errors/http-error.js'

interface MeetingTopics {
  week: string
  chapters: string
  songs: string[]
  treasures: string
  ministry: string[]
  christians: string[]
}

const defaultFetchOptions = {
  baseURL: 'https://wol.jw.org',
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JW-API/1.0)' },
} satisfies FetchOptions

async function getMeetingData(date: { week: number; year: number }) {
  const guidePath = await getGuidePath(date)
  if (!guidePath) throw NotFound('Guide not found for date given')
  return getMeetingObject(guidePath)
}

async function getGuidePath({
  week,
  year,
}: {
  week: number
  year: number
}): Promise<string | null> {
  const htmlText = await $fetch(`/es/wol/meetings/r4/lp-s/${year}/${week}`, {
    ...defaultFetchOptions,
  })

  const $ = cheerio.load(htmlText)

  const path = $('a[href*="/wol/d/r4/lp-s/"]').attr('href')

  return path ? path : null
}

async function getMeetingObject(path: string): Promise<MeetingTopics> {
  let meeting: MeetingTopics = {
    week: '',
    chapters: '',
    songs: [],
    treasures: '',
    ministry: [],
    christians: [],
  }
  const htmlText = await $fetch<string>(path, { ...defaultFetchOptions })

  const $ = cheerio.load(htmlText)

  meeting.week = $('#p1').clone().children().remove().end().text().trim()
  meeting.chapters = $('#p2 a')
    .map((_, el) => $(el).text())
    .get()
    .join('')
    .replace(/\u00a0/g, ' ')
    .trim()
  meeting.songs = $('.dc-icon--music a')
    .map((_, el) =>
      $(el)
        .text()
        .replace(/\u00a0/g, ' ')
        .trim()
    )
    .get()
  meeting.treasures = $('#p5').text().trim() + '(10 mins.)'
  meeting.ministry = $('h3.du-color--gold-700')
    .map((_, el) =>
      $(el).text().trim().concat(' ', $(el).next('div').children('p').text().slice(0, 9).trim())
    )
    .get()
  meeting.christians = $('h3.du-color--maroon-600')
    .map((_, el) =>
      $(el)
        .text()
        .trim()
        .concat(' ', $(el).next('div').find('p').first().text().slice(0, 10).trim())
    )
    .get()
  return meeting
}

export const scrapingService = { getMeetingData }
