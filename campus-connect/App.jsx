import React, { useEffect, useMemo, useState } from 'react'
import { Rocket, CalendarDays, Users, Bot, Briefcase, Bell, Plus, Check, Link as LinkIcon, Star, Send, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { campusBotReply } from './lib/campusBot'

// demo data
const demoEvents = [
    { id: 'e1', title: 'Intro to Google Cloud + Firebase', date: '2025-09-15', mode: 'On-campus', venue: 'CSE Seminar Hall', tags: ['cloud', 'firebase', 'backend'], link: 'https://cloud.google.com' },
    { id: 'e2', title: 'Build your first Android App', date: '2025-09-21', mode: 'Hybrid', venue: 'Lab 3 / Meet', tags: ['android', 'kotlin', 'ui'], link: 'https://developer.android.com' },
    { id: 'e3', title: 'GenAI + Vertex AI Hands-on', date: '2025-10-02', mode: 'Online', venue: 'Google Meet', tags: ['genai', 'vertex', 'ml'], link: 'https://cloud.google.com/vertex-ai' }
]

const demoProfiles = [
    { id: 'u1', name: 'Amit Sharma', year: '3rd Year', branch: 'CSE', skills: ['android', 'kotlin', 'ui'], lookingFor: ['teammates', 'mentorship'], bio: 'Android + Compose enthusiast.' },
    { id: 'u2', name: 'Riya Verma', year: '2nd Year', branch: 'IT', skills: ['cloud', 'firebase', 'backend'], lookingFor: ['hackathons'], bio: 'Cloud newbie, wants to learn Firebase.' },
    { id: 'u3', name: 'Mohit Agarwal', year: '4th Year', branch: 'AI/DS', skills: ['ml', 'genai', 'python'], lookingFor: ['research', 'mentorship'], bio: 'ML + GenAI projects, research focused.' },
    { id: 'u4', name: 'Neha Singh', year: '1st Year', branch: 'ECE', skills: ['ui', 'figma', 'web'], lookingFor: ['study-group'], bio: 'Design + web basics, exploring coding.' }
]

const careerLinks = [
    { title: 'Google Summer of Code (GSoC)', url: 'https://summerofcode.withgoogle.com/', type: 'program' },
    { title: 'Google Cloud Skills Boost', url: 'https://www.cloudskillsboost.google/', type: 'learning' },
    { title: 'Android Basics with Compose', url: 'https://developer.android.com/courses', type: 'learning' },
    { title: 'STEP Program', url: 'https://buildyourfuture.withgoogle.com/programs/step/', type: 'internship' },
    { title: 'Hash Code / Kick Start', url: 'https://codingcompetitionsonair.withgoogle.com/', type: 'contest' }
]

// local store hook
const useLocalStore = (key, initial) => {
    const [value, setValue] = useState(() => {
        try {
            const raw = localStorage.getItem(key)
            return raw ? JSON.parse(raw) : initial
        } catch { return initial }
    })
    useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)) } catch { } }, [key, value])
    return [value, setValue]
}

function jaccard(a, b) {
    const s1 = new Set(a), s2 = new Set(b)
    const inter = [...s1].filter(x => s2.has(x)).length
    const uni = new Set([...a, ...b]).size
    return uni === 0 ? 0 : inter / uni
}

function SectionHeader({ icon: Icon, title, description }) {
    return (
        <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-2xl bg-gray-100"><Icon className="w-5 h-5" /></div>
            <div>
                <h3 className="text-xl font-semibold">{title}</h3>
                {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
        </div>
    )
}

function EventCard({ ev, registered, onRegister }) {
    return (
        <div className="rounded-2xl shadow-sm bg-white p-4">
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-lg font-semibold">{ev.title}</div>
                    <div className="text-sm text-gray-500">{ev.date} • {ev.venue}</div>
                </div>
                <div className="text-sm"><span className="px-2 py-1 rounded-full bg-gray-100">{ev.mode}</span></div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {ev.tags.map(t => <span key={t} className="text-xs px-2 py-1 border rounded-full">#{t}</span>)}
            </div>
            <div className="mt-3 flex items-center gap-3">
                <a className="underline text-sm" href={ev.link} target="_blank" rel="noreferrer">Learn more</a>
                <div className="ml-auto">
                    <button onClick={() => onRegister(ev.id)} disabled={registered} className={`px-3 py-1 rounded-2xl ${registered ? 'bg-green-50 border' : 'bg-blue-600 text-white'}`}>
                        {registered ? <><Check className="inline w-4 h-4 mr-1" /> Registered</> : <><Plus className="inline w-4 h-4 mr-1" /> Register</>}
                    </button>
                </div>
            </div>
        </div>
    )
}

function ProfileCard({ p, score }) {
    return (
        <div className="rounded-2xl shadow-sm bg-white p-4">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">{p.name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500">{p.year} • {p.branch}</div>
                </div>
                <div className="ml-auto flex items-center gap-1 text-sm"><Star className="w-4 h-4" /> {(score * 5).toFixed(1)}</div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{p.bio}</p>
            <div className="mt-3 flex gap-2 flex-wrap">
                {p.skills.map(s => <span key={s} className="text-xs px-2 py-1 border rounded-full">{s}</span>)}
            </div>
            <div className="mt-3 flex gap-2">
                <button className="px-3 py-1 rounded-2xl border">Message</button>
                <button className="px-3 py-1 rounded-2xl bg-blue-50">Invite</button>
            </div>
        </div>
    )
}

function ChatBubble({ role, text }) {
    return (
        <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow ${role === 'user' ? 'bg-gray-900 text-white rounded-br-sm' : 'bg-gray-100 rounded-bl-sm'}`}>
                {text}
            </div>
        </div>
    )
}

export default function App() {
    const [q, setQ] = useState('')
    const [tab, setTab] = useState('events')
    const [registrations, setRegistrations] = useLocalStore('cc_regs', {})
    const [profile, setProfile] = useLocalStore('cc_profile', { name: 'You', skills: ['web', 'ui'], interests: ['android', 'cloud'], branch: 'CSE', year: '2nd Year' })
    const [chat, setChat] = useLocalStore('cc_chat', [{ role: 'bot', text: 'Hi! I am CampusBot. Ask me about events, peer matching, or Google programs.' }])
    const [sending, setSending] = useState(false)

    const events = useMemo(() => demoEvents.filter(ev => {
        if (!q) return true
        const lower = q.toLowerCase()
        return ev.title.toLowerCase().includes(lower) || ev.tags.some(t => t.includes(lower))
    }).sort((a, b) => a.date.localeCompare(b.date)), [q])

    const myTags = useMemo(() => [...(profile.skills || []), ...(profile.interests || [])], [profile])
    const matches = useMemo(() => demoProfiles.map(p => ({ p, score: jaccard(myTags, p.skills) })).sort((a, b) => b.score - a.score), [myTags])

    function handleRegister(id) {
        setRegistrations(prev => ({ ...prev, [id]: true }))
    }

    async function sendMessage(text) {
        if (!text?.trim()) return
        setSending(true)
        setChat(prev => [...prev, { role: 'user', text }])
        try {
            const reply = await campusBotReply(text)
            setChat(prev => [...prev, { role: 'bot', text: reply }])
        } catch (e) {
            setChat(prev => [...prev, { role: 'bot', text: 'Sorry, something went wrong. Try again.' }])
        } finally {
            setSending(false)
        }
    }

    useEffect(() => {
        // scroll-to-bottom behavior for chat: run after render
        const el = document.querySelector('#chat_scroll')
        if (el) el.scrollTop = el.scrollHeight
    }, [chat])

    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
                    <Rocket className="w-6 h-6" />
                    <h1 className="text-xl font-bold">Campus Connect</h1>
                    <div className="ml-2 px-2 py-1 rounded-full bg-gray-100 text-xs">Google Campus Ambassador</div>
                    <div className="ml-auto flex items-center gap-2">
                        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search events, skills, programs…" className="px-3 py-2 border rounded-2xl w-72" />
                        <button className="p-2 rounded-2xl border"><Bell className="w-4 h-4" /></button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex gap-2">
                    <button onClick={() => setTab('events')} className={`px-4 py-2 rounded-2xl ${tab === 'events' ? 'bg-gray-200' : 'bg-white'}`}><CalendarDays className="inline w-4 h-4 mr-2" />Event Hub</button>
                    <button onClick={() => setTab('peers')} className={`px-4 py-2 rounded-2xl ${tab === 'peers' ? 'bg-gray-200' : 'bg-white'}`}><Users className="inline w-4 h-4 mr-2" />Peer Connect</button>
                    <button onClick={() => setTab('career')} className={`px-4 py-2 rounded-2xl ${tab === 'career' ? 'bg-gray-200' : 'bg-white'}`}><Briefcase className="inline w-4 h-4 mr-2" />Career Hub</button>
                    <button onClick={() => setTab('chat')} className={`px-4 py-2 rounded-2xl ${tab === 'chat' ? 'bg-gray-200' : 'bg-white'}`}><Bot className="inline w-4 h-4 mr-2" />AI Chatbot</button>
                </div>

                {/* Events */}
                {tab === 'events' && (
                    <div className="mt-6">
                        <SectionHeader icon={CalendarDays} title="Event Hub" description="Register for workshops, hackathons, and study jams." />
                        <div className="grid md:grid-cols-2 gap-4">
                            {events.map(ev => (
                                <motion.div key={ev.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                                    <EventCard ev={ev} registered={!!registrations[ev.id]} onRegister={handleRegister} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Peers */}
                {tab === 'peers' && (
                    <div className="mt-6">
                        <SectionHeader icon={Users} title="Peer Connect" description="Find mentors, teammates, and study groups by skills/interests." />
                        <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 grid md:grid-cols-3 gap-3">
                            <input placeholder="Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="p-2 border rounded" />
                            <input placeholder="Year" value={profile.year} onChange={e => setProfile({ ...profile, year: e.target.value })} className="p-2 border rounded" />
                            <input placeholder="Branch" value={profile.branch} onChange={e => setProfile({ ...profile, branch: e.target.value })} className="p-2 border rounded" />
                            <input placeholder="Skills (comma)" value={(profile.skills || []).join(', ')} onChange={e => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="p-2 border rounded" />
                            <input placeholder="Interests (comma)" value={(profile.interests || []).join(', ')} onChange={e => setProfile({ ...profile, interests: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="p-2 border rounded" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {matches.map(({ p, score }) => (
                                <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                                    <ProfileCard p={p} score={score} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Career */}
                {tab === 'career' && (
                    <div className="mt-6">
                        <SectionHeader icon={Briefcase} title="Career Hub" description="Curated Google programs, learning paths, and opportunities." />
                        <div className="grid md:grid-cols-2 gap-4">
                            {careerLinks.map(c => (
                                <div key={c.title} className="rounded-2xl shadow-sm bg-white p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium">{c.title}</div>
                                        <div className="ml-auto text-sm text-gray-500">{c.type}</div>
                                    </div>
                                    <div className="mt-2"><a className="underline" href={c.url} target="_blank" rel="noreferrer">Open official page</a></div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 bg-white p-4 rounded-2xl shadow-sm">
                            <div className="font-medium">Opportunity Board</div>
                            <div className="text-sm text-gray-500">Post internships, projects, and research calls (demo).</div>
                            <div className="mt-3 grid gap-2">
                                <input placeholder="Title" className="p-2 border rounded" />
                                <textarea placeholder="Details" className="p-2 border rounded" />
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 rounded-2xl bg-blue-600 text-white"><Plus className="inline w-4 h-4 mr-2" />Post</button>
                                    <button className="px-3 py-1 rounded-2xl border">Save Draft</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chat */}
                {tab === 'chat' && (
                    <div className="mt-6">
                        <SectionHeader icon={Bot} title="AI Chatbot" description="Ask about events, matching, and Google resources." />
                        <div className="rounded-2xl shadow-sm bg-white">
                            <div id="chat_scroll" className="h-[380px] overflow-y-auto p-4 space-y-3">
                                {chat.map((c, i) => <ChatBubble key={i} role={c.role} text={c.text} />)}
                            </div>
                            <div className="border-t p-3 flex gap-2">
                                <input id="chat_input" placeholder="Type your question…" className="flex-1 p-2 border rounded" onKeyDown={e => { if (e.key === 'Enter') { sendMessage(e.currentTarget.value); e.currentTarget.value = ''; } }} />
                                <button className="px-3 py-1 rounded-2xl bg-blue-600 text-white" onClick={() => {
                                    const el = document.getElementById('chat_input')
                                    if (el) { sendMessage(el.value); el.value = '' }
                                }} disabled={sending}>
                                    {sending ? <Loader2 className="inline w-4 h-4 mr-1 animate-spin" /> : <Send className="inline w-4 h-4 mr-1" />} Send
                                </button>
                            </div>
                            <div className="p-3 text-xs text-gray-500">Demo mode: responses are rule-based. Replace with Dialogflow/Vertex AI in <code>src/lib/campusBot.js</code>.</div>
                        </div>
                    </div>
                )}

                <div className="mt-8 grid md:grid-cols-3 gap-4">
                    <div className="rounded-2xl shadow-sm bg-white p-4">
                        <div className="font-medium">Problem</div>
                        <div className="text-sm text-gray-600 mt-2">Fragmented access to campus resources, lack of mentor matching, and low awareness of Google opportunities.</div>
                    </div>
                    <div className="rounded-2xl shadow-sm bg-white p-4">
                        <div className="font-medium">Solution</div>
                        <div className="text-sm text-gray-600 mt-2">A unified platform with Event Hub, Peer Connect (ML matching), Career Hub, and an AI Chatbot powered by Google Cloud.</div>
                    </div>
                    <div className="rounded-2xl shadow-sm bg-white p-4">
                        <div className="font-medium">Impact</div>
                        <div className="text-sm text-gray-600 mt-2">Higher event participation, faster peer discovery, and increased adoption of Google developer tools on campus.</div>
                    </div>
                </div>
            </main>

            <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-xs text-gray-500">
                Built with React, Tailwind, lucide-react, and Framer Motion. Optional Firebase + Dialogflow integration.
            </footer>
        </div>
    )
}
