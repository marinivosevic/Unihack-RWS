import React from 'react'
import data from '../../app/utils/custom.geo.json'

const CountryList = () => (
    <ul>
        {data.features.map(
            (
                feature: {
                    properties: {
                        name:
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactElement<
                                  any,
                                  string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | Promise<React.AwaitedReactNode>
                            | null
                            | undefined
                    }
                },
                index: React.Key | null | undefined
            ) => (
                <li key={index}>{feature.properties.name}</li>
            )
        )}
    </ul>
)

export default CountryList
