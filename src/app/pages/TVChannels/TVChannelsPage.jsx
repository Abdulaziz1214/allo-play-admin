import React from 'react'
import Card from '../../components/ui/Card'

const TVChannelsPage = () => {
    return (
        <div>
            <Card>
                <h1 className="text-2xl font-semibold">TV Channels</h1>
                <p className="text-sm text-[var(--muted)] mt-2">
                    Управление ТВ-каналами и потоками.
                </p>
            </Card>
        </div>
    )
}

export default TVChannelsPage
