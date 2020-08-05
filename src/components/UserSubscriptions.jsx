import React, { useState, useEffect } from "react";
import { useQuery } from "urql";
import { userSubscriptionsQuery } from "../helpers/graph";
import SubscriptionsDisplay from "./SubscriptionsDisplay";
import Loading from "./Loading";

const UserSubscriptions = ({ address, isLoggedInUser }) => {
    const [allSubscriptions, setSubscriptions] = useState();
    const [res, executeQuery] = useQuery({
        query: userSubscriptionsQuery(address),
        requestPollicy: 'network-only'
    });

    useEffect(() => {
        if (
            res &&
            !res.error &&
            !res.fetching &&
            res.data.user &&
            res.data.user.subscriptions &&
            res.data.user.subscriptions.length
        ) {
            setSubscriptions(res.data.user.subscriptions);
        }
    }, [res]);

    if (res.fetching) return <Loading />;
    if (res.error) return <p>Errored!</p>;

    return (
        <div className="userSubscriptions">
            <span className="profileTitle">Subscriptions</span>
            {allSubscriptions ? (
                <SubscriptionsDisplay allSubscriptions={allSubscriptions} />
            ) : isLoggedInUser ? (
                <p>{"  You have no subscriptions"}</p>
            ) : (
                <p>{"  User has no subscriptions"}</p>
            )}
        </div>
    );
};

export default UserSubscriptions;
